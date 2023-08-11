import {
  AuthenticationDetails,
  CognitoUser,
  CognitoUserPool,
  CognitoUserSession,
  ICognitoUserData,
  ICognitoUserPoolData,
} from "amazon-cognito-identity-js";
import { CognitoIdentityCredentials, config } from "aws-sdk";
import { User } from "../model/movie-list.model";

type UserAttributes = { email: string; name: string };

export class AuthClient {
  private userPool: CognitoUserPool | null = null;
  private poolData: ICognitoUserPoolData | null = null;
  private _isSetUp = false;
  private _user?: User;

  get user() {
    return this._user;
  }

  constructor() {}

  get isSetUp() {
    return this._isSetUp;
  }

  async setUpAuth() {
    const userpoolIds = await (await fetch("/api/userpool")).json();
    this.poolData = {
      UserPoolId: userpoolIds.pool_id,
      ClientId: userpoolIds.client_id,
    };
    this.userPool = new CognitoUserPool(this.poolData);
    this._isSetUp = true;
  }

  /**
   * ユーザー名とパスワードに基づきログイン処理を行います。
   * @param name ユーザー名
   * @param password パスワード
   */
  async login(name?: string, password?: string): Promise<CognitoUserSession> {
    if (!name || !password) return this.getCognitoUserSession();
    const promise = new Promise<CognitoUserSession>((resolve, reject) => {
      if (!this.isSetUp) {
        reject(new AuthIsNotSetUpError());
        return;
      }
      let authenticationData = {
        Username: name!,
        Password: password!,
      };
      config.region = "ap-northeast-1";
      let authenticationDetails = new AuthenticationDetails(authenticationData);

      let userData = {
        Username: name!,
        Pool: this.userPool!,
      };

      let cognitoUser = new CognitoUser(userData);
      const callbacks = {
        onSuccess: (result: CognitoUserSession) => {
          console.log("ログイン成功", cognitoUser.getUsername());
          this._user = {
            cognitoUser,
            session: result,
          };
          resolve(result);
        },
        onFailure: (result: any) => {
          console.log("ログイン失敗");
          reject(new Error(result));
        },
        newPasswordRequired: (
          userAttributes: UserAttributes,
          requiredAttributes: any
        ) => {
          // console.log(userAttributes);
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

  async getCognitoUserSession(): Promise<CognitoUserSession> {
    const promsie = new Promise<CognitoUserSession>((resolve, reject) => {
      if (!this.isSetUp) {
        reject(new AuthIsNotSetUpError());
        return;
      }
      const currentUser = this.userPool!.getCurrentUser();
      if (!currentUser)
        return reject(new Error("ユーザーを取得することができませんでした。"));

      currentUser.getSession((error: any, data: any) => {
        if (error) {
          console.log("Login check error: ", error);
          reject((error as Error).message);
        } else {
          const session: CognitoUserSession = data;
          this._user = {
            cognitoUser: currentUser,
            session,
          };
          resolve(session);
        }
      });
    });
    return promsie;
  }

  async changePassword(oldPassword: string, newPassword: string) {
    if (!this._user) throw new Error("ユーザー情報を取得できませんでした。");
    return new Promise<string>((resolve, reject) => {
      this._user!.cognitoUser.changePassword(
        oldPassword,
        newPassword,
        (error, result) => {
          if (error) {
            reject(error);
          } else {
            resolve(result!);
          }
        }
      );
    });
  }
}

class AuthIsNotSetUpError extends Error {
  constructor(args?: any) {
    super(args);
    this.name = "AuthIsNotSetUpError";
  }
}
