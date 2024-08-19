import qs from "qs";
import { authenticate } from "~/shopify.server";

import type { ActionFunction } from "@remix-run/node";

/**
 * First step of authorization - loader will redirect to google oAuth2
 */
const CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const AUTH_URL = "https://accounts.google.com/o/oauth2/auth";

export let action: ActionFunction = async ({ request }) => {
  const { redirect } = await authenticate.admin(request);
  const scopes =
    "openid email profile https://www.googleapis.com/auth/adwords https://www.googleapis.com/auth/content";

  const shopRedirect =
    "https://pushing-stuffed-sunset-iowa.trycloudflare.com/auth/callback";
  const params = {
    response_type: "code",
    client_id: CLIENT_ID,
    redirect_uri: shopRedirect,
    scope: scopes,
    access_type: "offline",
  };

  const authUrl = `${AUTH_URL}?${qs.stringify(params)}`;
  return redirect(authUrl);
};
