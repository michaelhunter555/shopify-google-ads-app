import type { AppUserContext } from "~/context/auth-context";

let initialState = {
  sessionId: "",
  googleAccountId: "",
  merchantCenterId: "",
  mccAccountId: "",
};

type Action = {
  type: "LOGIN" | "LOGOUT" | "UPDATE";
  sessionId?: string;
  googleAccountId?: string;
  merchantCenterId?: string;
  mccAccountId?: string;
};

export const authReducer = (state: AppUserContext, action: Action) => {
  switch (action.type) {
    case "LOGIN":
      return {
        ...state,
        sessionId: action.sessionId, // should be same for both session and google auth
        googleAccountId: action.googleAccountId,
        merchantCenterId: action.merchantCenterId,
        mccAccountId: action.mccAccountId,
      };

    case "LOGOUT":
      return initialState;

    case "UPDATE":
      return {
        ...state,
        sessionId: action.sessionId, // should be same for both session and google auth
        googleAccountId: action.googleAccountId,
        merchantCenterId: action.merchantCenterId,
        mccAccountId: action.mccAccountId,
      };
  }
};
