import { createContext, useContext, useState } from "react";

export interface AppUserContext {
  sessionId?: string;
  googleAccountId?: string;
  merchantCenterId?: string;
  mccAccountId?: string;
  setUser?: (user: Partial<AppUserContext>) => void;
}

export const UserContext = createContext<AppUserContext | undefined>(undefined);

const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<Partial<AppUserContext>>({});

  const updateUser = (userData: Partial<AppUserContext>) => {
    setUser((prev) => ({ ...prev, userData }));
  };

  return (
    <UserContext.Provider value={{ ...user, setUser: updateUser }}>
      {children}
    </UserContext.Provider>
  );
};

export default UserProvider;

export const useAuthContext = () => {
  const googleAuth = useContext(UserContext);

  if (googleAuth === undefined) {
    console.log("no Auth Found");
  }

  return { googleAuth };
};
