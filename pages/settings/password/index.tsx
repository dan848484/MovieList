import { NextPage } from "next";
import { Title } from "../../../src/components/atoms/title/title";
import {
  PasswordChanger,
  PasswordChangerViewMode,
} from "../../../src/components/organisms/password-changer/password-changer";
import { useState } from "react";
import { useRouter } from "next/router";

const Password: NextPage = () => {
  const [viewMode, setViewMode] =
    useState<PasswordChangerViewMode>("old-password");
  const router = useRouter();

  const onBackButtonClick = () => {
    switch (viewMode) {
      case "old-password":
        router.replace("/settings");
        break;
      case "new-password":
        setViewMode("old-password");
        break;
    }
  };

  const getBackButtonText = () => {
    switch (viewMode) {
      case "old-password":
        return "設定";
      case "new-password":
        return getTitleText("old-password");
    }
  };

  const getTitleText = (viewMode: PasswordChangerViewMode) => {
    switch (viewMode) {
      case "old-password":
        return "現在のパスワード";
      default:
        return "新規パスワード";
    }
  };

  return (
    <div className="px-5 pt-10">
      <Title
        backButtonText={getBackButtonText()}
        onBackButtonClick={onBackButtonClick}
      >
        <span>{getTitleText(viewMode)}</span>
      </Title>

      <PasswordChanger
        viewMode={viewMode}
        setViewMode={setViewMode}
      ></PasswordChanger>
    </div>
  );
};

export default Password;
