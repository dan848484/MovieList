import { CircularProgress } from "@mui/material";
import { useState, useEffect, createContext, ReactNode, FC } from "react";
import { useDispatch } from "react-redux";
import { Auth } from "../../../auth/auth";
import { setToken, TokenState } from "../../../redux/slices/token-slice";
import {
  movieApi,
  useGetMoviesQuery,
} from "../../../redux/services/movie-service";
import { LoginForm } from "../../organisms/login-form/login-form";
import { useSelector } from "react-redux";
import { RootState } from "../../../redux/store";

interface AuthComponentProps {
  children?: ReactNode;
}

export const AuthComponent: FC<AuthComponentProps> = (props) => {
  const [isLoading, setIsLoading] = useState(true);
  const [loginRequired, setLoginRequired] = useState(true);
  const [auth] = useState(new Auth());
  const dispatch = useDispatch();

  const login = async () => {
    const session = await auth.isLogined();
    setLoginRequired(false);
    const token = session.getIdToken().getJwtToken();
    const expire = session.getIdToken().getExpiration() + new Date().getTime();
    const tokenState: TokenState = {
      token,
      expire,
    };
    dispatch(setToken(tokenState));
  };

  /**
   * ログイン成功時
   */
  const handleFormComplete = () => {
    setLoginRequired(false);
    login();
  };

  useEffect(() => {
    (async () => {
      try {
        await auth.setUpAuth();
        await login();
      } catch (error) {
        console.log(
          "ログインが完了していません。ログインフォームに遷移します。",
          error
        );
      }
      setIsLoading(false);
    })();
  }, []);

  return (
    <>
      {isLoading && (
        <div className="w-screen h-screen flex justify-center items-center ">
          <CircularProgress className="[zoom:1.5]" />
        </div>
      )}
      {!isLoading && (
        <>
          {loginRequired && (
            <LoginForm onComplete={handleFormComplete} auth={auth}></LoginForm>
          )}
          {!loginRequired && props.children}
        </>
      )}
    </>
  );
};
