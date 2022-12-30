import { CognitoUser, CognitoUserSession } from "amazon-cognito-identity-js";

export interface UserInfo {
  cognitoUser: CognitoUser;
  session: CognitoUserSession;
}
