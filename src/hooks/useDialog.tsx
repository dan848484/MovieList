import { Dialog } from "@mui/material";
import { useMemo } from "react";
import { FC, useState } from "react";

type UseDialog<T = any> = (
  component: FC<DialogContentProps<T>>,
  data?: T,
  closeEvent?: (data?: T) => void
) => [JSX.Element, () => void, () => void, boolean];
export type DialogContentProps<T> = {
  open: () => void;
  close: (data?: any) => void;
  isOpen: boolean;
  data?: T;
};
export type DialogContent<T> = FC<DialogContentProps<T>>;

export const useDialog: UseDialog = <T,>(
  Content: FC<DialogContentProps<T>>,
  data?: T,
  closeEvent?: (data?: T) => void
) => {
  const [isOpen, setIsOpen] = useState(false);
  const open = () => {
    setIsOpen(true);
  };
  const close = (data?: T) => {
    closeEvent && closeEvent(data);
    setIsOpen(false);
  };
  const component = useMemo(() => {
    return (
      <Dialog open={isOpen} className="rounded-[23px]">
        <Content
          open={open}
          close={close}
          isOpen={isOpen}
          data={data}
        ></Content>
      </Dialog>
    );
  }, [isOpen]);

  return [component, open, close, isOpen];
};
