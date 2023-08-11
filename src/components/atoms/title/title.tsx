import { ReactElement, ReactNode } from "react";
import style from "./title.module.scss";
import { Button } from "@mui/material";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";

interface TitleProps {
  children: ReactNode;
  backButtonText?: string;
  onBackButtonClick?: () => void;
}

export const Title = (props: TitleProps) => {
  if (props.backButtonText) {
    return (
      <div className={style.titleWithButtonContainer}>
        <div className={style.leftArea}>
          <Button
            variant="text"
            className={style.backButton}
            onClick={props.onBackButtonClick}
          >
            <ArrowBackIosIcon></ArrowBackIosIcon>
            <div className={style.backButtonText}>{props.backButtonText}</div>
          </Button>
        </div>
        <div className={style.centerArea}>{props.children}</div>
        <div className={style.rightArea}></div>
      </div>
    );
  }
  return <h1 className="text-3xl font-bold">{props.children}</h1>;
};
