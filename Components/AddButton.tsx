import * as React from "react";
import { ButtonBase, ThemeProvider } from "@mui/material";
import { ButtonUnstyled } from "@mui/base";
import { Add } from "@mui/icons-material";
import { createTheme } from "@mui/material";

interface Props {
  onClick?: () => void;
}

export const AddButton: React.FCX<Props> = (props) => {
  const theme = createTheme({
    components: {
      MuiButtonBase: {
        styleOverrides: {
          root: {
            backgroundColor: "#3b82f6",
            borderRadius: "50%",
            position: "unset",
          },
        },
      },
    },
  });
  return (
    <ThemeProvider theme={theme}>
      <div className={`${props.className} rounded-full`}>
        <ButtonBase
          className=" w-[70px] h-[70px] shadow-xl  "
          onClick={props.onClick}
        >
          <Add className="text-white [zoom:1.8] "></Add>
        </ButtonBase>
      </div>
    </ThemeProvider>
  );
};
