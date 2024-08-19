import axios from "axios";
import prisma from "~/db.server";
import { encryptData } from "~/util/encryption/encryptData";

import refreshAccessToken from "./refreshAccessToken";

// Function to check if the access token is valid
const isTokenValid = async (token: string): Promise<boolean> => {
  try {
    const testUrl = `https://www.googleapis.com/oauth2/v1/tokeninfo?access_token=${token}`;
    await axios.get(testUrl);
    return true;
  } catch (error) {
    return false;
  }
};

const checkAccessToken = async (
  accessToken: string,
  refreshToken: string,
  id: string,
): Promise<boolean> => {
  // Check if the access token is valid
  const tokenValid = await isTokenValid(accessToken);

  // If the token is not valid, refresh it
  if (!tokenValid && refreshToken) {
    try {
      accessToken = await refreshAccessToken(refreshToken);
      // Update the user's access token in the database
      const encryptedAccessToken = encryptData(accessToken);
      await prisma.googleAuth.update({
        where: { id: id },
        data: {
          access_token: encryptedAccessToken,
        },
      });

      return true;
    } catch (err: any) {
      return err;
    }
  }

  return tokenValid;
};

export default checkAccessToken;
