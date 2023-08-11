import React from "react";
import { AuthClient } from "../../../auth-client/authClient";
import { useForm, Controller } from "react-hook-form";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import LoadingButton from "@mui/lab/LoadingButton";
type FormInputs = {
  mailadress: string;
  password: string;
};

export interface Props {
  auth: AuthClient;
  onComplete: () => void;
}

export const LoginForm: React.FC<Props> = (props) => {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    control,
  } = useForm<FormInputs>();
  const [isLoading, setIsLoading] = React.useState(false);
  const handleLoginButton = async () => {
    setIsLoading(true);
    try {
      const session = await props.auth.login(
        watch("mailadress"),
        watch("password")
      );
      props.onComplete();
    } catch (error) {
      console.log(error);
    }
    setIsLoading(false);
  };

  return (
    <div className="p-5 w-screen  flex flex-col justify-center items-center h-screen">
      <h1 className="text-5xl mb-5 font-bold">MovieList</h1>
      <form
        onSubmit={handleSubmit(handleLoginButton)}
        className=" flex flex-col items-center"
      >
        <Controller
          name="mailadress"
          control={control}
          defaultValue=""
          rules={{
            // pattern:
            //   /^[a-zA-Z0-9_.+-]+@([a-zA-Z0-9][a-zA-Z0-9-]*[a-zA-Z0-9]*\.)+[a-zA-Z]{2,}$/,
            required: true,
          }}
          render={({ field, fieldState: { error } }) => {
            console.log(error, !!error);
            return (
              <TextField
                className="mt-5 w-80"
                label="メールアドレス"
                error={!!error}
                {...field}
              />
            );
          }}
        />
        <Controller
          name="password"
          control={control}
          defaultValue=""
          rules={{
            min: 8,
            required: true,
          }}
          render={({ field, fieldState: { error } }) => {
            return (
              <TextField
                className="mt-5 w-80"
                label="パスワード"
                error={!!error}
                {...field}
                type="password"
              />
            );
          }}
        />
        <LoadingButton
          className="mt-7 w-24"
          type="submit"
          loading={isLoading}
          variant="contained"
          disableElevation
          // onClick={handleLoginButton}
        >
          ログイン
        </LoadingButton>
      </form>
    </div>
  );
};
