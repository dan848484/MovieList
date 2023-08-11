import { NextPage } from "next";
import { SettingItemButton } from "../../src/components/moleculs/setting-item-button/setting-item-button";
import { Title } from "../../src/components/atoms/title/title";

export const Settings: NextPage = () => {
  return (
    <div className="px-5 pt-10">
      <Title>
        <span>設定</span>
      </Title>
      <SettingItemButton
        href="/settings/password"
        text="パスワードの変更"
      ></SettingItemButton>
    </div>
  );
};

export default Settings;
