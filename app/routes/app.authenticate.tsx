import type { ShopifySession } from "types";
import checkAccessToken from "~/lib/google/checkAccessToken";

import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { redirect, useFetcher, useLoaderData } from "@remix-run/react";
import { TitleBar } from "@shopify/app-bridge-react";
import {
  BlockStack,
  Button,
  Card,
  Divider,
  Layout,
  List,
  Page,
  Text,
} from "@shopify/polaris";
import { LogoGoogleIcon } from "@shopify/polaris-icons";

import { authenticate } from "../shopify.server";
import { findOrCreateUser } from "./api/authentication/google-user";

/**
 * Check if the user is authenticated or not.
 * They can choose to authorize the app by clickin either button
 * after which they will be redirected to the authorization process by google
 * after authorizing the app the user should redirected auth.callback.tsx
 * then back to app.authenticate
 * TODO: logout of app functionality
 */
export const loader = async ({ request }: LoaderFunctionArgs) => {
  const { session } = await authenticate.admin(request);

  let isAuthenticated: boolean = false;
  if (session.id) {
    const user = await findOrCreateUser(session as ShopifySession);

    if (user && user.access_token && user.refresh_token) {
      isAuthenticated = await checkAccessToken(
        user.access_token,
        user.refresh_token,
        user.id,
      );
    }
  }
  return { isAuthenticated };
};

//begins oAuth2 Google Process
const action = async ({ request }: ActionFunctionArgs) => {
  return redirect("/auth/start");
};

export default function GoogleAuth() {
  const { isAuthenticated } = useLoaderData<typeof loader>();
  const fetcher = useFetcher<typeof action>();

  const handleUserAuthentication = () => {
    if (!isAuthenticated) {
      fetcher.submit(null, { method: "POST", action: "/auth/start" });
    }
  };

  return (
    <Page>
      <TitleBar title="Connect to Google">
        <button onClick={handleUserAuthentication}>
          {!isAuthenticated ? "Connect to Google" : "Authenticated"}
        </button>
      </TitleBar>
      <BlockStack gap="500">
        <Layout>
          <Layout.Section>
            <Card>
              <BlockStack gap="200">
                <Text variant="headingMd" as="h2">
                  Authenticate your account with Google
                </Text>
                <Button>Connect to Google</Button>
              </BlockStack>
            </Card>
          </Layout.Section>
          <Layout.Section variant="oneThird">
            <BlockStack gap="500">
              <Card>
                <BlockStack gap="500">
                  <Text variant="headingMd" as="h2">
                    Services required:
                  </Text>
                  <List>
                    <List.Item>
                      <Text as="p">
                        Authorization to view, edit & manage your Google Ads
                        account
                      </Text>
                    </List.Item>
                    <List.Item>
                      <Text as="p">
                        Authorization to view, edit & manage your Google Ads
                        account
                      </Text>
                    </List.Item>
                    <List.Item>
                      <Text as="p">
                        You must have an active Google Ads Account & Merchant
                        center associated with your gmail
                      </Text>
                    </List.Item>
                  </List>
                  <Divider />
                  <Button
                    onClick={handleUserAuthentication}
                    icon={LogoGoogleIcon}
                    variant={isAuthenticated ? "plain" : "primary"}
                    tone={isAuthenticated ? "critical" : "success"}
                  >
                    {isAuthenticated ? "Disconnect" : "Connect to Google"}
                  </Button>
                </BlockStack>
              </Card>
            </BlockStack>
          </Layout.Section>
        </Layout>
      </BlockStack>
    </Page>
  );
}
