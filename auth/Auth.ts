import {
  AuthenticationDetails,
  CognitoUser,
  CognitoUserPool,
  CognitoUserSession,
  ICognitoUserData,
  ICognitoUserPoolData,
} from "amazon-cognito-identity-js";
import { CognitoIdentityCredentials, config } from "aws-sdk";

export class Auth {
  private userPool: CognitoUserPool;
  private poolData: ICognitoUserPoolData;
  constructor() {
    this.poolData = {
      UserPoolId: "ap-northeast-1_eSVsdBM5q",
      ClientId: "5bosqe5a0lq8ctj36i41hkbj1n",
    };
    this.userPool = new CognitoUserPool(this.poolData);
  }

  /**
   * ユーザー名とパスワードに基づきログイン処理を行います。
   * @param name ユーザー名
   * @param password パスワード
   */
  async login(name: string, password: string): Promise<CognitoUserSession> {
    const promise = new Promise<CognitoUserSession>((resolve, reject) => {
      let authenticationData = {
        Username: name,
        Password: password,
      };
      config.region = "ap-northeast-1";
      let authenticationDetails = new AuthenticationDetails(authenticationData);

      let userData = {
        Username: name,
        Pool: this.userPool,
      };

      let cognitoUser = new CognitoUser(userData);

      const callbacks = {
        onSuccess: (result) => {
          console.log("ログイン成功", result);
          resolve(result);
        },
        onFailure: (result) => {
          console.log("ログイン失敗", result);
          reject(new Error(result));
        },
        newPasswordRequired: (userAttributes, requiredAttributes) => {
          console.log(userAttributes);
          cognitoUser.completeNewPasswordChallenge(
            authenticationData.Password,
            {},
            callbacks
          );
        },
      };

      cognitoUser.authenticateUser(authenticationDetails, callbacks);
    });
    return promise;
  }

  /**
   * ログイン状態であればセッションオブジェクトを返します。
   * @returns
   */
  async isLogined(): Promise<CognitoUserSession> {
    const promsie = new Promise<CognitoUserSession>((resolve, reject) => {
      const currentUser = this.userPool.getCurrentUser();
      if (!currentUser)
        return reject(new Error("ユーザーを取得することができませんでした。"));

      currentUser.getSession((error: any, data: any) => {
        if (error) {
          console.log("Login check error: ", error);
          reject((error as Error).message);
        } else {
          const session: CognitoUserSession = data;
          resolve(session);
        }
      });
    });
    return promsie;
  }
}
