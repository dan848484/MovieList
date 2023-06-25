import { NextPage } from "next";
import { SettingItemButton } from "../../src/components/moleculs/setting-item-button/setting-item-button";

export const Settings: NextPage = () => {
  return (
    <div className="px-5 pt-10">
      <h1 className="text-3xl font-bold">設定</h1>
      <SettingItemButton
        href="/settings/password"
        text="パスワードの変更"
      ></SettingItemButton>
    </div>
  );
};

export default Settings;
