import { CognitoUser, CognitoUserSession } from "amazon-cognito-identity-js";

export interface IMovie {
  id: string;
  name: string;
  addedDate: number;
  watched: boolean;
}

export interface Movie extends IMovie {
  hidden: boolean;
  isBeingUpdated: boolean;
}

export interface User {
  cognitoUser: CognitoUser;
  session: CognitoUserSession;
}

export type MessageType = "update" | "delete" | "add";

export interface WebSocketMessage {
  action: string;
  message: {
    messageType: MessageType;
    movie: Movie;
  };
}
