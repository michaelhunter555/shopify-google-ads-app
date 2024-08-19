import qs from 'qs';

import { redirect } from '@remix-run/node';

const CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const REDIRECT_URI =
  "https://admin.shopify.com/store/google-sopping-ads/apps/testing-cli-10/app/auth/callback";
const AUTH_URL = "https://accounts.google.com/o/oauth2/auth";

export let handleOAuth = async () => {
  const scopes =
    "openid email profile https://www.googleapis.com/auth/adwords https://www.googleapis.com/auth/content";

  const params = {
    response_type: "code",
    access_type: "offline",
    scopes,
    client_id: CLIENT_ID,
    redirect_uri: REDIRECT_URI,
  };

  const oAuthUrl = `${AUTH_URL}?${qs.stringify(params)}`;

  return redirect(oAuthUrl);
};

export default function GoogleOAuth() {
  return null;
}
