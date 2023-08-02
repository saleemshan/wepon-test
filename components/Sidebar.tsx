import React from "react";
import Image from "next/image";
import { mdiWhiteBalanceSunny } from "@mdi/js";
import Icon from "@mdi/react";
import { mdiMoonWaningCrescent } from "@mdi/js";

<Icon path={mdiMoonWaningCrescent} size={1} />;
import LogoDark from "../assets/icons/logoDark.svg";
import keyIcon from "../assets/icons/key.svg";
import swardIcon from "../assets/icons/swordIcon.svg";
import glovesIcon from "../assets/icons/glouseIcon.svg";
import LogoLight from "../assets/icons/logoLight.svg";
<Icon path={mdiWhiteBalanceSunny} size={1} />;

import { useTheme } from "../providers/ThemeContext";
import useScreenSize from "../hooks/useScreenSize";

// import { Icon } from '@chakra-ui/react'
// import { MdSettings } from 'react-icons/md'

const Sidebar = () => {
  const { isDarkMode, toggleTheme } = useTheme();
  const screenSize = useScreenSize();
  return (
    <aside
      className={`md:w-[134px] w-full h-[90px] md:h-full z-50 ${
        isDarkMode
          ? "bgNavDark bottomBarMobDark"
          : "bgNavLight bottomBarMobLight"
      }   py-9 px-7 fixed  bottom-0  left-0 md:top-0 flex md:flex-col justify-center md:justify-start items-center gap-y-16`}
    >
      <div className="md:block hidden">
        <Image src={isDarkMode ? LogoDark : LogoLight} alt="logo" />
      </div>
      <div className="flex md:flex-col justify-between items-center w-full md:h-full ">
        <div className="flex  md:w-auto md:p-0 md:flex-col items-center justify-between gap-y-10 cursor-pointer w-3/4 ">
          <Image
            className="mt-4"
            width={screenSize === "small" ? 30 : 40}
            src={swardIcon}
            alt="Icon"
          />
          <Image
            src={keyIcon}
            width={screenSize === "small" ? 30 : 40}
            alt="Icon"
          />
          <Image
            src={glovesIcon}
            width={screenSize === "small" ? 56 : 86}
            alt="Icon"
          />
        </div>
        <div className="w-1/4 md:w-full flex justify-end md:justify-center">
          <>
            <input
              onClick={toggleTheme}
              type="checkbox"
              className="checkbox"
              id="checkbox"
            />
            <label
              htmlFor="checkbox"
              className={`${
                isDarkMode ? "bg-white" : "bg-dark"
              } checkbox-label md:!px-3 !px-2`}
            >
              <Icon
                path={mdiWhiteBalanceSunny}
                color={"black"}
                size={screenSize==="small" ? "14px":"16px"}
              />
              <Icon
                path={mdiMoonWaningCrescent}
                color={"white"}
                size={screenSize==="small" ? "14px":"16px"}
                className="rotate-[-30deg]"
              />
              <span
                className={`${
                  !isDarkMode ? "bg-primary-pink" : "bg-primary-pink"
                } flex items-center justify-center ball`}
              >
                {isDarkMode ? (
                  <>
                    <Icon
                      path={mdiMoonWaningCrescent}
                      className="rotate-[-30deg]"
                      color={isDarkMode ? "black" : "black"}
                      size={screenSize==="small" ? "14px":"16px"}
                    />
                  </>
                ) : (
                  <>
                    <Icon
                      path={mdiWhiteBalanceSunny}
                      color={isDarkMode ? "black" : "black"}
                      size={screenSize==="small" ? "14px":"16px"}
                    />
                  </>
                )}
              </span>
            </label>
          </>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
