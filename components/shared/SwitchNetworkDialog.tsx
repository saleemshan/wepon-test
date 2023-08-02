import { useState } from "react";
import Image from "next/image";
import SwitchNetworkIcon from "../../assets/icons/switchNetwork.svg"

import { useTheme } from "../../providers/ThemeContext";
import useScreenSize from "../../hooks/useScreenSize";

interface IProps {
  setShow: React.Dispatch<React.SetStateAction<boolean>>;
  onConfirm?: () => void;
  isLoading?: boolean;
    show: boolean;
}

const SwitchNetworkDialog: React.FC<IProps> = ({setShow,show,onConfirm}) => {
  const screenSize = useScreenSize();
  const {isDarkMode} = useTheme()
  return (
    <>
      {show && (
        <>
          <div className="fixed inset-0 z-50 overflow-y-auto">
          <div
              className="fixed inset-0 w-full h-full bg-[#1111214d] backdrop-blur-[12px]"
              onClick={() => setShow(false)}
            ></div>
            <div className="flex items-center min-h-screen">
              <div
                className={`relative mx-auto ${isDarkMode ? "bg-[#231D5D]" : "bg-white"} flex-shrink-0 rounded-[24px] shadow-lg w-[350px] h-[484px] md:w-[776px] md:h-[505px]
                }`}
              >
                <button
                  type="button"
                  className="absolute top-[30px] right-[30px]"
                  data-te-modal-dismiss
                  aria-label="Close"
                  onClick={() => setShow(false)}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="23"
                    viewBox="0 0 24 23"
                    fill="none"
                  >
                    <path
                      d="M1.5 1L22.5 22"
                      stroke="#AAAAC8"
                      strokeWidth="2"
                      strokeLinecap="round"
                    />
                    <path
                      d="M22.5 1L1.5 22"
                      stroke="#AAAAC8"
                      strokeWidth="2"
                      strokeLinecap="round"
                    />
                  </svg>
                </button>
                <div className="w-full flex justify-center mt-[74px]">
                  <Image src={SwitchNetworkIcon} width={screenSize==="large" ? "111px" : "92px"} height={screenSize==="large" ? "129px" : "107"} alt=""/>
                </div>
                <div className="text-center sm:text-left">
                  <div>
                    <p className={`text-2xl md:text-[40px] ${isDarkMode ? "text-white" :"text-[#231D5D]"} font-BebasNeue letter-spacing-[-0.8px] text-center font-normal mt-[30px]`}>
                      Switch Network to polygon?
                    </p>
                  </div>
                  <div className="mt-[6px] items-center">
                    <p className={`${isDarkMode ? "text-white opacity-[0.5]" : "text-[#7054A1]"}  font-inter letter-spacing-[-0.4px] text-center text-[16px] md:text-lg font-medium items-center px-6 md:px-[88px]`}>
                    Currently you are not on the Polygon network, please proceed after switching to the Polygon network
                    </p>
                  </div>
                  <div className="flex items-center justify-center">
                    <button onClick={onConfirm} className="btnPrimary rounded-xl mt-6 bg-primary-pink text-lg font-inter font-bold text-center">
                      Switch to Polygon
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default SwitchNetworkDialog;
