import { BottomNavigation, BottomNavigationAction } from "@mui/material";
import {
  ReactElement,
  ReactNode,
  ReactPropTypes,
  SyntheticEvent,
  useEffect,
  useState,
} from "react";
import { TaskAlt } from "@mui/icons-material";
import { Settings } from "@mui/icons-material";
import { useRouter } from "next/router";

type LayoutProps = {
  children: ReactNode;
};

export default function Layout({ children }: LayoutProps) {
  const [pageName, setPageName] = useState("/");
  const router = useRouter();
  const onPageChange = (event: SyntheticEvent, newValue: string) => {
    setPageName(newValue);
    router.push(newValue);
  };

  useEffect(() => {
    const page = router.route.split("/")[1];
    setPageName(`/${page}`);
  }, []);

  return (
    <>
      <div className="h-full w-full flex flex-col">
        <div className="w-full flex-1 flex-grow h-0 flex-shrink ">
          {children}
        </div>
        <div className="w-full h-16 flex-grow-0 flex-shrink-0  border-t-[1px]">
          <BottomNavigation
            style={{ width: "100%" }}
            className="h-full"
            showLabels
            value={pageName}
            onChange={onPageChange}
          >
            <BottomNavigationAction
              label="ホーム"
              value="/"
              icon={<TaskAlt />}
            ></BottomNavigationAction>
            <BottomNavigationAction
              label="設定"
              value="/settings"
              icon={<Settings />}
            ></BottomNavigationAction>
          </BottomNavigation>
        </div>
      </div>
    </>
  );
}
