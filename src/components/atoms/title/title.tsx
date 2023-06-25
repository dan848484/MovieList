import { ReactElement, ReactNode } from "react";

interface TitleProps {
  children: ReactNode;
}

export const Title = (props: TitleProps) => {
  return <h1 className="text-3xl font-bold">{props.children}</h1>;
};
