import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import Link from "next/link";
export interface SettingItemButtonProps {
  text: string;
  href: string;
}

export const SettingItemButton = (props: SettingItemButtonProps) => {
  return (
    <>
      <Link href={props.href} className="">
        <div className="w-full hover:cursor-pointer bg-gray-200 px-6 h-14 py-2 rounded-xl mt-5 flex justify-center items-center">
          <p className="flex-grow text-gray-700 flex-shrink-0 text-start  overflow-hidden text-ellipsis whitespace-nowrap">
            {props.text}
          </p>
          <div className="flex-grow-0 flex-shrink px-2 text-gray-500 flex justify-center">
            <ArrowForwardIosIcon
              fontSize="small"
              className="relative top-[1px]"
            ></ArrowForwardIosIcon>
          </div>
        </div>
      </Link>
    </>
  );
};
