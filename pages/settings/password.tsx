import { NextPage } from "next";
import { Title } from "../../src/components/atoms/title/title";
import { PasswordChanger } from "../../src/components/organisms/password-changer/password-changer";

const Password: NextPage = () => {
  return (
    <div className="px-5 pt-10">
      <Title>
        <span>パスワードの変更</span>
      </Title>
      <PasswordChanger></PasswordChanger>
    </div>
  );
};

export default Password;
