import { createContext } from "react";
import { AuthClient } from "../auth-client/authClient";

export const AuthClientContext = createContext<AuthClient | undefined>(
  undefined
);
