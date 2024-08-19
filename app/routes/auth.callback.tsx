import axios from "axios";
import qs from "qs";
import prisma from "~/db.server"; // Adjust path as needed
import { authenticate } from "~/shopify.server";
import { encryptData } from "~/util/encryption/encryptData";

import type { LoaderFunction } from "@remix-run/node";
import { json } from "@remix-run/node";

/**
 * When a user authorizes the app, they will be redirected to this page.
 * for purpose of /auth/callback, we will retrieve the tokens google issued
 * and exchange them for access and refresh tokens. We will encrypt tokens
 * and store them on MongoDb.
 */

const USER_INFO_URL = "https://www.googleapis.com/oauth2/v3/userinfo";
const TOKEN_URL = "https://oauth2.googleapis.com/token";
const CLIENT_ID = process.env.GOOGLE_CLIENT_ID!;
const CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET!;
const REDIRECT_URI =
  "https://pushing-stuffed-sunset-iowa.trycloudflare.com/auth/callback";

export let loader: LoaderFunction = async ({ request }) => {
  const { redirect, session } = await authenticate.admin(request);
  const url = new URL(request.url);
  const code = url.searchParams.get("code");

  if (!code) {
    console.log("error with retrieving code.");
    return redirect("/app/authenticate");
  }

  const tokenData = {
    code,
    client_id: CLIENT_ID,
    client_secret: CLIENT_SECRET,
    redirect_uri: REDIRECT_URI,
    grant_type: "authorization_code",
  };

  try {
    const response = await axios.post(TOKEN_URL, qs.stringify(tokenData), {
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
    });

    const { access_token, refresh_token } = response.data;
    const encryptedAccessToken = encryptData(String(access_token));
    const encryptedRefreshToken = encryptData(String(refresh_token));

    const userInfo = await axios.post(USER_INFO_URL, {
      headers: { Authorization: `'Bearer ${access_token}` },
    });

    const { email } = userInfo.data;
    console.log("Email from:", email);

    // Store tokens in MongoDB using Prisma
    await prisma.googleAuth.update({
      where: { id: session.id },
      data: {
        ...(email && { email: email }),
        access_token: encryptedAccessToken,
        refresh_token: encryptedRefreshToken,
      },
    });

    return redirect("/app/authenticate"); // Redirect to a success page or another route as needed
  } catch (error) {
    console.error("Failed to exchange code for tokens", error);
    return json(
      { error: "Failed to exchange code for tokens." },
      { status: 500 },
    );
  }
};
