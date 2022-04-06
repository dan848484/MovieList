import {
  AuthenticationDetails,
  CognitoUser,
  CognitoUserPool,
  ICognitoUserData,
  ICognitoUserPoolData,
} from "amazon-cognito-identity-js";
import { CognitoIdentityCredentials, config } from "aws-sdk";
import { UserInfo } from "../model/User.model";
export class Auth {
  private userInfo?: UserInfo;
  private userPool: CognitoUserPool;
  private poolData: ICognitoUserPoolData;
  constructor() {
    this.poolData = {
      UserPoolId: "ap-northeast-1_eSVsdBM5q",
      ClientId: "5bosqe5a0lq8ctj36i41hkbj1n",
    };
    this.userPool = new CognitoUserPool(this.poolData);
  }

  login(name: string, password: string) {
    let authenticationData = {
      Username: name,
      Password: password,
    };
    config.region = "ap-northeast-1";
    let authenticationDetails = new AuthenticationDetails(authenticationData);

    let userData = {
      Username: "tom",
      Pool: this.userPool,
    };

    let cognitoUser = new CognitoUser(userData);
    cognitoUser.authenticateUser(authenticationDetails, {
      onSuccess: (result) => {
        console.log("ログイン成功", result);
        this.userInfo = {
          cognitoUser: cognitoUser,
          session: result,
        };

        console.log(result.getAccessToken().getExpiration());
        console.log(this.isLogined());
      },
      onFailure: (result) => {
        console.log("ログイン失敗", result);
      },
      newPasswordRequired: (userAttributes, requiredAttributes) => {
        console.log(userAttributes);
        cognitoUser.completeNewPasswordChallenge(
          authenticationData.Password,
          {},
          this as any
        );
      },
    });
  }

  isLogined() {
    const currentUser = this.userPool.getCurrentUser();
    if (!this.userInfo || !currentUser) return false;
    currentUser.ve;
  }

  getUserInfo() {
    return this.userInfo;
  }
}
