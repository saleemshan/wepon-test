import { useDisclosure } from "@chakra-ui/react";
import { useWeb3React } from "@web3-react/core";
// import { Link } from 'react-router-dom';
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import Logo from "../assets/imgs/logo_transparent.svg";
import SelectWalletModal from "../utils/WalletModal";
import { useTheme } from "../providers/ThemeContext";
import useScreenSize from "../hooks/useScreenSize";
import LogoDark from "../assets/icons/logoDark.svg";
import LogoLight from "../assets/icons/logoLight.svg";
import coinIcon from "../assets/icons/coinIcon.svg";

interface NavbarProps {
  setConnectedNetwork: Function;
}

declare global {
  interface Window {
    ethereum?: any;
  }
}

const Navbar: React.FC<NavbarProps> = (props) => {
  const { isDarkMode } = useTheme();
  const screenSize = useScreenSize();

  const { isOpen, onOpen, onClose } = useDisclosure();
  const [AccountID, setAccountID] = useState("");
  const { active, account, library, connector, activate, deactivate, chainId } =
    useWeb3React();

  const [connectedNetwork, setConnectedNetwork] = useState("");

  useEffect(() => {
    console.log("account: ", account);
    console.log("chainId: ", chainId);
    console.log("active: ", active);

    if (active) {
      // if the user has a connected wallet
      setConnectedNetwork(getNetworkName(chainId));
      props.setConnectedNetwork(getNetworkName(chainId));
      let str_temp =
        (account as string).slice(0, 6) + "..." + (account as string).slice(-4);
      setAccountID(str_temp);
    } else {
      setConnectedNetwork("");
      props.setConnectedNetwork("");
    }
  }, [account, chainId]);

  const getNetworkName = (chainID: any) => {
    switch (chainID) {
      case 1:
        return "ETH mainnet";
      case 3:
        return "ETH Ropsten testnet";
      case 4:
        return "ETH Rinkeby testnet";
      case 5:
        return "ETH Goerli testnet";
      case 42:
        return "ETH Kovan testnet";
      case 100:
        return "ETH XDai testnet";
      case 137:
        return "Polygon mainnet";
      case 80001:
        return "Mumbai testnet";
      default:
        return "";
    }
  };

  async function disconnect(e: any) {
    try {
      window.localStorage.setItem("provider", "");
      deactivate();
    } catch (ex) {
      console.log(ex);
    }
  }

  return (
    <div
      className={`${
        isDarkMode ? "text-white bottomBarMobDark" : "text-dark bg-white"
      } flex justify-between items-center h-[90px] md:py-9 md:px-12 px-5 fixed md:relative md:bg-transparent top-0 z-50  w-full`}
    >
      <div className="flex items-center h-full">
        <span className="text-4xl font-BebasNeue hidden md:inline">
          Weapon Forge
        </span>
        {screenSize === "small" && (
          <Image
            src={isDarkMode ? LogoDark : LogoLight}
            alt="logo"
            width={30}
          />
        )}
      </div>
      <div className="flex items-center gap-x-[10px] sm:gap-x-4">
        <div
          className={`${
            isDarkMode ? "bg-dark-primary" : "bg-white border border-[#7054a11a]"
          } width-[119px] height-[42px] flex items-center rounded-[50px] gap-x-[10px] p-[6px] pr-8 md:flex md:items-center md:gap-x-[10px] md:p-[10px] md:pr-8 font-inter cursor-pointer md:border-0`}
        >
          <Image
            src={coinIcon}
            width={screenSize !== "large" ? "25px" : "38px"}
            height={screenSize !== "large" ? "25px" : "38px"}
            alt="coin"
          />
          <div className="flex flex-col">
            <span
              className={`text-[10px] md:text-xs font-medium ${
                isDarkMode ? "text-white opacity-[0.5]" : "text-primary-purple"
              }`}
            >
              Balance
            </span>
            <p
              className={` text-xs md:text-sm font-semibold ${
                isDarkMode ? "text-white" : "text-primary-dark"
              }`}
            >
              100 GCOIN
            </p>
          </div>
        </div>
        <div
          className={`connection ${
            isDarkMode ? "btnDark text-white " : "btnLight text-dark border border-[#7054a11a]"
          } flex justify-between items-center md:border-0`}
        >
          <div className="div-connect-btn">
            <div onClick={screenSize!=="large" && connectedNetwork ? disconnect : onOpen} className="flex items-center mr-4 ">
              <div
                className={` w-[10px] h-[10px] md:w-[14px] md:h-[14px] ${
                  connectedNetwork ? "bg-[#57D12C]" : "bg-[#F11616]"
                }`}
                style={{
                  display: "inline-block",
                  borderRadius: 14,
                  marginRight: 10,
                }}
              ></div>
              {connectedNetwork ? connectedNetwork : "Not Connected"}
            </div>
          </div>

          {screenSize === "large" && (
            <button
              className="connect-btn !bg-primary-green"
              onClick={connectedNetwork ? disconnect : onOpen}
            >
              {connectedNetwork ? AccountID : "Connect"}
            </button>
          )}

          <SelectWalletModal isOpen={isOpen} closeModal={onClose} />
        </div>
      </div>
    </div>
  );
};

export default Navbar;
