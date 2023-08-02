import { useDisclosure } from "@chakra-ui/react";
import { useWeb3React } from "@web3-react/core";
// import { Link } from 'react-router-dom';
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import Logo from "../assets/imgs/logo_transparent.svg";
import SelectWalletModal from "../utils/WalletModal";

interface NavbarProps {
  setConnectedNetwork: Function;
}

declare global {
  interface Window {
    ethereum?: any;
  }
}

const Navbar: React.FC<NavbarProps> = (props) => {
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
      className="bg-black text-white flex justify-between items-center font-Righteous"
      style={{ background: "rgba(35, 30, 90, 0.8)", height: 108 }}
    >
      <div className="flex items-center h-full">
        <Link href="/">
          <div
            className="h-full flex items-center"
            style={{ background: "#231E5E" }}
          >
            <Image className="" alt="Logo Image" src={Logo} width={100} />
          </div>
        </Link>
        <span className="text-5xl hidden lg:inline ml-6">Weapon Forge</span>
      </div>
      <div className="connection flex justify-between items-center">
        <div className="div-connect-btn">
          {connectedNetwork ? (
            <div
              style={{ backgroundColor: "rgba(255, 255, 255, 0.10)" }}
              className="flex items-center mr-4"
            >
              <div
                style={{
                  display: "inline-block",
                  width: 14,
                  height: 14,
                  background: "rgba(255, 255, 255, 0.10)",
                  borderRadius: 14,
                  marginRight: 10,
                }}
              ></div>
              {connectedNetwork}
            </div>
          ) : (
            <div
              style={{ backgroundColor: "rgba(255, 255, 255, 0.10)" }}
              className="flex items-center mr-4"
            >
              <div
                style={{
                  display: "inline-block",
                  width: 14,
                  height: 14,

                  borderRadius: 14,
                  marginRight: 10,
                }}
              ></div>
              Not Connected
            </div>
          )}
        </div>
        <button
          className="!bg-primary-green"
          onClick={connectedNetwork ? disconnect : onOpen}
        >
          {connectedNetwork ? AccountID : "Connect"}
        </button>
        <SelectWalletModal isOpen={isOpen} closeModal={onClose} />
      </div>
    </div>
  );
};

export default Navbar;
