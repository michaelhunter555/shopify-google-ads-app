import { decryptData } from "~/util/encryption/decryptData";
import { encryptData } from "~/util/encryption/encryptData";

import type { GoogleAuthUser, ShopifySession } from "../../../../types";
import prisma from "../../../db.server";

//find google user
export const findUser = async (id: string) => {
  await prisma.googleAuth.findUnique({
    where: { id: id },
  });
};

//create new user
export const findOrCreateUser = async (session: ShopifySession) => {
  //try to find user
  const existingUser = await prisma.session.findUnique({
    where: { id: session.id },
  });

  const googleAuthUser = await prisma.googleAuth.findUnique({
    where: { id: session.id },
  });

  //if not create a new session for user
  if (!existingUser) {
    await prisma.session.create({
      data: {
        id: session.id,
        shop: session.shop,
        isOnline: session.isOnline,
        scope: session.scope,
        state: session.state,
        accessToken: session.accessToken,
        userId: session.userId,
      },
    });
  }

  let updatedUser;
  if (!googleAuthUser) {
    updatedUser = await prisma.googleAuth.upsert({
      where: { id: session.id },
      update: {
        name: session.shop, //shop name, default
        googleAccountId: "",
        merchantCenterId: "",
        selectedClientId: "",
        access_token: "",
        refresh_token: "",
        createdCampaigns: 0,
        campaignQuota: 10,
        totalCreatedCampaigns: 0,
      },
      create: {
        id: session.id,
        name: session.shop, //shop name, default
        googleAccountId: "",
        merchantCenterId: "",
        selectedClientId: "",
        access_token: "",
        refresh_token: "",
        createdCampaigns: 0,
        campaignQuota: 10,
        totalCreatedCampaigns: 0,
      },
    });
  }
  //create association between session and google account

  const user = updatedUser ?? googleAuthUser;

  return user;
};

export const authenticateGoogleUser = async (
  googleUser: GoogleAuthUser,
  id: string,
) => {
  if (googleUser?.access_token || googleUser.refresh_token) {
    const encryptedAccessToken = encryptData(String(googleUser.access_token));
    const encryptedRefreshToken = decryptData(String(googleUser.refresh_token));
    await prisma.googleAuth.update({
      where: { id: id },
      data: {
        googleAccountId: googleUser?.googleAccountId,
        access_token: encryptedAccessToken,
        refresh_token: encryptedRefreshToken,
      },
    });
  }
};
