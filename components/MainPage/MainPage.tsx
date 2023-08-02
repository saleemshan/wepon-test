import {
  useRef,
  useEffect,
  useState,
  useLayoutEffect,
  SetStateAction,
} from "react";
import AddPolygon from "./AddPolygon";
import { useWeb3React } from "@web3-react/core";
import { connectors } from "../../utils/WalletConnectors";
import SliderItems from "./SliderItems";
import SelectedItems from "./SelectedItems";
import ForgedItems from "./ForgedItems";
import Forge from "./Forge";
import Web3 from "web3";
import useScreenSize from "../../hooks/useScreenSize";
import SwitchNetworkDialog from "../shared/SwitchNetworkDialog";
interface MainPageProps {
  connectedNetwork: string;
}
interface ItemProvider {
  tokenId: string;
  amount: number;
  isEnabled: boolean;
}

const MainPage: React.FC<MainPageProps> = (props) => {
  const { active, account, library, connector, activate, deactivate, chainId } =
    useWeb3React();
  const [switchedNetwork, setSwitchedNetwork] = useState(false);
  const [isPolygonAdded, setIsPolygonAdded] = useState(false);
  const [tabIndex, setTabIndex] = useState(0);
  const [selectedItemsList, setSelectedItemsList] = useState<string[]>([]);
  const [removedItem, setRemovedItem] = useState("");
  const [toggleRunRemovedItem, setToggleRunRemovedItem] = useState(true);
  const [remainedSelectedItem, setRemainedSelectedItem] = useState("");
  const [forgedItemsList, setForgedItemsList] = useState<any[]>([]);
  const [rewardItemsList, setRewardItemsList] = useState<any[]>([]);
  const [isForgingSuccess, setIsForgingSuccess] = useState(false);
  const [toggleReloadItems, setToggleReloadItems] = useState(false);
  const [currentProgress, setCurrentProgress] = useState(0);
  const [flagIsRed, setFlagIsRed] = useState(false);
  const [currentWeaponStatus, setCurrentWeaponStatus] = useState("");
  const [currentForgeCost, setCurrentForgeCost] = useState<string[]>([]);
  const [flagForSelectAsteroid, setFlagForSelectAsteroid] = useState(false); // Check enable/disable slider items when select asteroid weapons
  const [transactionId, setTransactionId] = useState("000");
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isShowVideo, setIsShowVideo] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [showSwitchNetworkDialog, setShowSwitchNetworkDialog] = useState(false);

  console.log(forgedItemsList, rewardItemsList);

  const screenSize = useScreenSize();

  function checkWindowSize() {
    console.log("[", window.innerWidth, window.innerHeight, "]");
    if (window.innerWidth <= 1024) setIsMobile(true);
    else setIsMobile(false);
  }
  if (typeof window != "undefined") {
    window!.onload = checkWindowSize;
    window!.onresize = checkWindowSize;
  }

  useEffect(() => {
    //    console.log("props.connectedNetwork::: ", props.connectedNetwork);
    if (
      props.connectedNetwork === "Polygon mainnet" ||
      props.connectedNetwork === "Mumbai testnet"
    ) {
      setSwitchedNetwork(true);
      setIsPolygonAdded(true);
    } else {
      setSwitchedNetwork(false);
    }
  }, [props.connectedNetwork]);

  useEffect(() => {
    setSelectedItemsList([]);
  }, [account, props.connectedNetwork]);

  const LoadingOwnedItems = async (message: string) => {
    console.log("currentWeaponStatus: ", message);
    setCurrentWeaponStatus(message);
  };
  const event_IDs: number[] = [];
  function isDuplicate(event_id: number) {
    if (event_IDs.includes(event_id)) return true;
    event_IDs.push(event_id);
    console.log("event_id :: ", event_id);
    return false;
  }

  async function loadCurrentForgeCost() {
    try {
      if (!library?._provider) return;
      console.log("loadCurrentForgeCost() called");
      const provider = library._provider;
      const web3 = new Web3(provider);

      const GFCBlackSmith_CONTRACT = require("../../constants/GFCBlackSmith_Contract.json");
      const GFCBlackSmith_ContractAddress =
        props.connectedNetwork === "Polygon mainnet"
          ? GFCBlackSmith_CONTRACT.MainNetAddress
          : GFCBlackSmith_CONTRACT.TestNetAddress;
      const GFCBlackSmithContract = new web3.eth.Contract(
        GFCBlackSmith_CONTRACT.ABI,
        GFCBlackSmith_ContractAddress
      );

      const tierCosts = await GFCBlackSmithContract.methods
        .getForgeCost()
        .call();

      setCurrentForgeCost(
        tierCosts.map((tier: any) =>
          Web3.utils.fromWei(tier.toString(), "ether")
        )
      );
    } catch (err) {
      console.log("err: ", err);
    }
  }

  useEffect((): any => {
    //    console.log("=== chainId: ", chainId, " ===");
    //    console.log("props.connectedNetwork ::: ", props.connectedNetwork);
    const GFCBlackSmith_CONTRACT = require("../../constants/GFCBlackSmith_Contract.json");
    const GFCBlackSmith_ContractAddress =
      props.connectedNetwork === "Polygon mainnet"
        ? GFCBlackSmith_CONTRACT.MainNetAddress
        : GFCBlackSmith_CONTRACT.TestNetAddress;

    const NODE_URL =
      props.connectedNetwork === "Polygon mainnet"
        ? "wss://polygon-mainnet.g.alchemy.com/v2/510KsHatNA0k1cJ_2GofoAkwsYV8SJUT"
        : "wss://polygon-mumbai.g.alchemy.com/v2/510KsHatNA0k1cJ_2GofoAkwsYV8SJUT";
    const event_web3 = new Web3(NODE_URL);

    const event_GFCBlackSmithContract = new event_web3.eth.Contract(
      GFCBlackSmith_CONTRACT.ABI,
      GFCBlackSmith_ContractAddress
    );

    let options = {
      filter: {
        value: [],
      },
      fromBlock: "latest",
    };

    event_GFCBlackSmithContract.events
      .WeaponForged(options)
      .on("data", (event: any) => {
        if (!isDuplicate(event.id)) {
          if (event.returnValues.transactionId === transactionId) {
            let values = Object.values(event.returnValues);
            if (account === values[0]) {
              console.log("event => ", event);
              setForgedItemsList([values[1]]);
            }
          }
        }
      })
      .on("changed", (changed: any) => console.log(changed))
      .on("error", (err: any) => err)
      .on("connected", (str: string) => {});

    event_GFCBlackSmithContract.events
      .WeaponReversed(options)
      .on("data", (event: any) => {
        if (!isDuplicate(event.id)) {
          if (event.returnValues.transactionId === transactionId) {
            let values = Object.values(event.returnValues);
            if (account === values[0]) {
              console.log("event reversed => ", event);
              const existingList = !!window.localStorage.getItem("forgedList")
                ? JSON.parse(window.localStorage.getItem("forgedList") || "")
                : [];
              console.log("existingList: ", existingList);
              window.localStorage.setItem(
                "forgedList",
                JSON.stringify([Number(values[1]), ...existingList])
              );
              setForgedItemsList([values[1], ...existingList]);
            }
          }
        }
      })
      .on("changed", (changed: any) => console.log(changed))
      .on("error", (err: any) => err)
      .on("connected", (str: string) => {});

    event_GFCBlackSmithContract.events
      .RewardMinted(options) //RewardMinted event always occurs after WeaponForged event occured
      .on("data", (event: any) => {
        console.log("RewardMinted event:::::::: ", event);
        if (!isDuplicate(event.id)) {
          if (event.returnValues.transactionId === transactionId) {
            let values = Object.values(event.returnValues);
            if (account === values[0]) {
              console.log("event => ", event);
              setRewardItemsList([values[1]]);
            }
          }
        }
      })
      .on("changed", (changed: any) => console.log(changed))
      .on("error", (err: any) => err)
      .on("connected", (str: string) => {});

    loadCurrentForgeCost();
  }, [chainId, props.connectedNetwork, transactionId]);

  function swtichToPolygon() {
    setIsPolygonAdded(true);
    const { ethereum } = window;
    ethereum
      .request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: "0x89" }],
      })
      .then((result: any) => {
        setSwitchedNetwork(true);
      })
      .catch((switchError: { code: number }) => {
        console.log("switchError.code: ", switchError.code);
        if (switchError.code === 4902 || switchError.code === -32603) {
          //4902 for desktop, -32603 for mobile
          ethereum
            .request({
              method: "wallet_addEthereumChain",
              params: [
                {
                  chainId: "0x89",
                  chainName: "Polygon",
                  nativeCurrency: {
                    name: "Matic",
                    symbol: "MATIC",
                    decimals: 18,
                  },
                  rpcUrls: [
                    "https://polygon-mainnet.g.alchemy.com/v2/510KsHatNA0k1cJ_2GofoAkwsYV8SJUT",
                  ],
                  // rpcUrls: ["https://polygon-rpc.com/"],
                  blockExplorerUrls: ["https://polygonscan.com/"],
                },
              ],
            })
            .catch((addError: any) => {
              console.log("Add network error!", addError);
            });
        }
      })
      .finally(() => {
        activate(connectors["injected"]);
      });
  }

  const CheckIsRed = async (array: string[]) => {
    //Initalise the weapon forge rate;
    let weaponForgeRate =
      tabIndex === 0 ? [0, 2, 2, 2, 2, 2, 2, 2] : [0, 1, 1, 1, 1, 1, 1, 1, 1];

    if (array.length > 0) {
      let tier = Number(array[0].toString().charAt(1));
      if (array.length === weaponForgeRate[tier]) setFlagIsRed(true);
      else setFlagIsRed(false);
      let count_13001 = array.filter((x) => x === "13001").length;
      let count_24005 = array.filter((x) => x === "24005").length;
      if (count_13001 > 1 || count_24005 > 1) setFlagIsRed(false);
      if (
        array.includes("16000") ||
        array.includes("26000") ||
        array.includes("26001")
      ) {
        setFlagForSelectAsteroid(true);
        if (array.length > 2) {
          if (
            array.includes("16000") &&
            array.includes("26000") &&
            array.includes("26001") &&
            array.length === 3
          ) {
            setFlagIsRed(true);
            setFlagForSelectAsteroid(false);
          } else setFlagIsRed(false);
        }
      }
    } else {
      setFlagIsRed(false);
    }
  };

  const onItemSelected = async (tokenId: string) => {
    console.log("Selected tokenId: ", tokenId);
    let array = [...selectedItemsList]; // make a separate copy of the array
    array.push(tokenId);
    array.sort();
    setSelectedItemsList(array);
    CheckIsRed(array);
  };
  const onItemRemoved = async (tokenId: string) => {
    console.log("Removed tokenId: ", tokenId);
    let array = [...selectedItemsList]; // make a separate copy of the array
    let index = array.indexOf(tokenId);
    if (index !== -1) {
      array.splice(index, 1);
      setSelectedItemsList(array);
      CheckIsRed(array);
    }
    setRemovedItem(tokenId);
    setRemainedSelectedItem(array[0]);
    setToggleRunRemovedItem(!toggleRunRemovedItem);
  };
  const onForgingSuccess = async () => {
    console.log("Forging Success!");
    if (!isMobile) {
      if (videoRef) {
        setIsShowVideo(true);
        videoRef.current!.play();
      }
      setTimeout(() => {
        setIsForgingSuccess(true);
        setCurrentProgress(0);
      }, 11 * 1000); //after 10 second
    } else {
      setIsForgingSuccess(true);
      setCurrentProgress(0);
    }
  };
  const returnClicked = async () => {
    console.log("returnClicked!");
    setFlagIsRed(false);
    setIsForgingSuccess(false);
    setSelectedItemsList([]);
    setToggleReloadItems(!toggleReloadItems);
    if (!isMobile) setIsShowVideo(false);
  };
  const onForgingStarted = async () => {
    console.log("Forging Started!");
    setFlagIsRed(false);
    setRewardItemsList([]);
  };
  const SetCurrentProgressOfForging = async (CurrentProgress: number) => {
    console.log("Current Progress ::: ", CurrentProgress);
    setCurrentProgress(CurrentProgress);
  };

  const SetTransactionId = async (transactionId: string) => {
    console.log("SetTransactionID ::: ", transactionId);
    setTransactionId(transactionId);
  };

  useEffect(() => {
    if (!switchedNetwork && isPolygonAdded) {
      setShowSwitchNetworkDialog(true);
    }else{
      setShowSwitchNetworkDialog(false);
    }
  }, [switchedNetwork, isPolygonAdded]);

  return (
    <div>
      {isShowVideo && !isMobile && (
        <>
          <video ref={videoRef} className="w-full z-10 absolute">
            <source src="videos/ForgeSuccess.mp4" type="video/mp4" />
          </video>
          {isForgingSuccess && <div className="absolute video-front-div"></div>}
        </>
      )}
      <div>
        {!switchedNetwork && !isPolygonAdded ? (
          <div className="px-5 md:px-0">
          <AddPolygon swtichToPolygon={swtichToPolygon} />
          </div>
        ) : (
          <></>
        )}
        {switchedNetwork && isPolygonAdded ? (
          <div className="flex justify-between flex-col md:flex-row mb-16 gap-6">
            <div className="w-full px-5 md:px-0">
              {!isForgingSuccess ? (
                <SelectedItems
                  selectedItemsList={selectedItemsList}
                  onItemRemoved={onItemRemoved}
                  currentProgress={currentProgress}
                  currentWeaponStatus={currentWeaponStatus}
                />
              ) : (
                <ForgedItems
                  forgedItemsList={forgedItemsList}
                  rewardItemsList={rewardItemsList}
                  returnClicked={returnClicked}
                />
              )}
            </div>
            {screenSize === "large" && (
              <div className="w-full lg:w-2/6">
                <Forge
                  isRed={flagIsRed && !isForgingSuccess}
                  isDemantleValid={selectedItemsList.length >= 1}
                  account={account}
                  setForgedItemsList={setForgedItemsList}
                  connectedNetwork={props.connectedNetwork}
                  selectedItemsList={selectedItemsList}
                  setTabIndex={setTabIndex}
                  tabIndex={tabIndex}
                  currentForgeCost={currentForgeCost}
                  onForgingSuccess={onForgingSuccess}
                  SetCurrentProgressOfForging={SetCurrentProgressOfForging}
                  onForgingStarted={onForgingStarted}
                  SetTransactionId={SetTransactionId}
                />
              </div>
            )}
          </div>
        ) : (
          <></>
        )}
      </div>

      {switchedNetwork && isPolygonAdded && (
        <SliderItems
          account={account}
          isDemantle={tabIndex === 1}
          connectedNetwork={props.connectedNetwork}
          onItemSelected={onItemSelected}
          removedItem={removedItem}
          remainedSelectedItem={remainedSelectedItem}
          toggleRunRemovedItem={toggleRunRemovedItem}
          toggleReloadItems={toggleReloadItems}
          isDisableAll={
            !flagForSelectAsteroid && flagIsRed && !isForgingSuccess
          }
          LoadingOwnedItems={LoadingOwnedItems}
        />
      )}

      {switchedNetwork && isPolygonAdded && screenSize !== "large" && (
        <div className="w-full mt-5">
          <Forge
            isRed={flagIsRed && !isForgingSuccess}
            isDemantleValid={selectedItemsList.length >= 1}
            account={account}
            setForgedItemsList={setForgedItemsList}
            connectedNetwork={props.connectedNetwork}
            selectedItemsList={selectedItemsList}
            setTabIndex={setTabIndex}
            tabIndex={tabIndex}
            currentForgeCost={currentForgeCost}
            onForgingSuccess={onForgingSuccess}
            SetCurrentProgressOfForging={SetCurrentProgressOfForging}
            onForgingStarted={onForgingStarted}
            SetTransactionId={SetTransactionId}
          />
        </div>
      )}
      <SwitchNetworkDialog
        setShow={setShowSwitchNetworkDialog}
        show={showSwitchNetworkDialog}
        onConfirm={swtichToPolygon}
      />
    </div>
  );
};

export default MainPage;
