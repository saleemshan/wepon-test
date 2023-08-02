import { useEffect, useState, useLayoutEffect } from "react";
import Slider from "react-slick";

import Icon from "@mdi/react";
import { mdiArrowLeft, mdiArrowRight } from "@mdi/js";

<Icon path={mdiArrowLeft} size={1} />;
import Web3 from "web3";
import ItemOfSlider from "./ItemOfSlider";
import { useWeb3React } from "@web3-react/core";
import { useTheme } from "../../providers/ThemeContext";
interface SliderItemsProps {
  account: any;
  connectedNetwork: string;
  onItemSelected: Function;
  removedItem: string;
  remainedSelectedItem: string;
  toggleRunRemovedItem: boolean;
  toggleReloadItems: boolean;
  isDisableAll: boolean;
  LoadingOwnedItems: Function;
  isDemantle: boolean;
}

interface ItemProvider {
  tokenId: string;
  amount: number;
  isEnabled: boolean;
}

const unusedTokenIDs = [
  34001, 34002, 35001, 42002, 42003, 43001, 43002, 43003, 43004, 43004, 43005,
  43006, 43007, 43008, 43009, 43010, 44001, 44002, 44003, 44004, 45001, 45002,
  45003, 45004, 45005, 46001,
];

let tokenId_List = [
  11000, 11001, 11002, 12000, 12001, 13000, 13001, 14000, 14001, 14002, 15000,
  15001, 16000, 17000, 18000, 21000, 21001, 22000, 22001, 22002, 22003, 23000,
  23001, 23002, 23003, 23004, 23005, 23006, 23007, 23008, 23009, 23010, 24000,
  24001, 24002, 24003, 24004, 24005, 25000, 25001, 25002, 25003, 25004, 25005,
  26000, 26001, 27000, 28000, 31000, 31001, 31002, 31003, 31004, 31005, 31006,
  32000, 32001, 32002, 32003, 32004, 32005, 32006, 33000, 34000, 34001, 34002,
  35000, 35001, 36000, 37000, 38000, 41000, 41001, 41002, 42000, 42001, 42002,
  42003, 43000, 43001, 43002, 43003, 43004, 43005, 43006, 43007, 43008, 43009,
  43010, 44000, 44001, 44002, 44003, 44004, 45000, 45001, 45002, 45003, 45004,
  45005, 46000, 46001, 47000, 48000,
];

const SliderItems: React.FC<SliderItemsProps> = (props) => {
  const { isDarkMode } = useTheme();
  const [SlilderSettings, setSlilderSettings] = useState({
    className: "center",
    infinite: false,
    variableWidth: true,
    adaptiveHeight: true,
    slidesToShow:
      typeof window !== "undefined"
        ? window.screen.availWidth >= 1280
          ? 6
          : window.screen.availWidth >= 1024
          ? 4
          : window.screen.availWidth >= 768
          ? 3
          : window.screen.availWidth >= 320
          ? 2
          : 1
        : 6,
    slidesToScroll:
      typeof window !== "undefined"
        ? window.screen.availWidth >= 1280
          ? 3
          : window.screen.availWidth >= 320
          ? 2
          : 1
        : 3,
    draggable: false,
    dots: false,
    speed: 500,
    rows: 1,
    slidesPerRow: 1,
  });
  const [size, setSize] = useState([0, 0]);
  const { library } = useWeb3React();

  useEffect(() => {
    //    console.log("size changed");
    function updateSize() {
      setSize([window.innerWidth, window.innerHeight]);
    }
    window.addEventListener("resize", updateSize);
    updateSize();
    return () => window.removeEventListener("resize", updateSize);
  }, []);

  useEffect(() => {
    //    console.log("size[0]: ",size[0]);
    setSlilderSettings({
      className: "slider variable-width",
      infinite: false,
      variableWidth: true,
      adaptiveHeight: true,
      slidesToShow:
          size[0] >= 1280
          ? 6
          : size[0] >= 1024
          ? 4
          : size[0] >= 768
          ? 3
          : size[0] >= 320
          ? 2
          : 1,
      slidesToScroll:
        size[0] >= 1280
          ? 6
          : size[0] >= 1024
          ? 4
          : size[0] >= 768
          ? 3
          : size[0] >= 320
          ? 2
          : 1,
      draggable: true,
      dots: false,
      speed: 500,
      rows: 1,
      slidesPerRow: 1,
    });
  }, [size]);

  const provider = library?._provider;
  const [OwnedItems, SetOwnedItems] = useState<ItemProvider[]>([]);

  const GetOwnedItem = async () => {
    console.log("Reload owned items");

    if (typeof window !== "undefined" && !provider) return;
    const web3 = new Web3(provider);
    const CONTRACT = require("../../constants/GFCGenesisWeapon_Contract.json");
    const array: ItemProvider[] = [];

    if (props.account !== undefined) {
      //only run when connected to the Polygon MainNet or Mumbai TestNet because if user connected to the other Net, this component will not be rendered
      // SetOwnedItems([]);
      //      console.log(props.connectedNetwork);
      const ContractAddress = CONTRACT.MainNetAddress;
      const WeaponContract = new web3.eth.Contract(
        CONTRACT.ABI,
        ContractAddress
      );
      for (let i = 0; i < tokenId_List.length; i++) {
        //you have to use for(;;) instead of forEach() to use await
        await WeaponContract.methods
          .balanceOf(props.account, tokenId_List[i])
          .call({ from: props.account })
          .then((result: string) => {
            if (
              Number(result) !== 0 &&
              !unusedTokenIDs.includes(tokenId_List[i])
            ) {
              let val = {
                tokenId: tokenId_List[i].toString(),
                amount: Number(result),
                isEnabled: true,
              };
              array.push(val);
            }
          })
          .catch((err: any) => {
            console.error(err);
          });
      }
    }
    SetOwnedItems(array);
    if (array.length > 0) props.LoadingOwnedItems("loaded");
    else props.LoadingOwnedItems("no weapons");
  };

  useEffect(() => {
    props.LoadingOwnedItems("loading");
    GetOwnedItem();
  }, [props.account, props.connectedNetwork, props.toggleReloadItems]);

  const IncreaseAmountOfToken = async () => {
    let array = [...OwnedItems]; // make a separate copy of the array
    let index = array.findIndex((item) => item.tokenId === props.removedItem);
    if (index !== -1) {
      //      console.log("props.removedItem: ", props.removedItem);
      array[index].amount += 1;
      array[index].isEnabled = true;
      SetOwnedItems(array);
    }
  };

  useEffect(() => {
    IncreaseAmountOfToken();
    MakeDisabledItem(props.remainedSelectedItem);
  }, [props.toggleRunRemovedItem]); //called when user remove item from Selection box

  const DecreaseAmountOfToken = async (tokenId: string) => {
    console.log("DecreaseAmountOfToken");
    let array = [...OwnedItems]; // make a separate copy of the array
    let index = array.findIndex((item) => item.tokenId === tokenId);
    if (index !== -1) {
      array[index].amount -= 1;
      if (array[index].amount === 0) {
        array[index].isEnabled = false;
      }
      SetOwnedItems(array);
    }
  };

  const MakeDisabledItem = (tokenId: string) => {
    let array = [...OwnedItems];
    array.map((item) => {
      if (tokenId === "" || tokenId === undefined) {
        item.isEnabled = true;
      } else {
        if (item.tokenId.charAt(0) !== tokenId.charAt(0)) {
          item.isEnabled = false;
        } else if (item.tokenId.charAt(1) !== tokenId.charAt(1)) {
          item.isEnabled = false;
        } else if (item.amount == 0) {
          item.isEnabled = false;
        } else {
          item.isEnabled = true;
        }
        if (
          tokenId.charAt(1) === "6" &&
          item.tokenId.charAt(1) === "6" &&
          item.amount > 0
        )
          //logic for 16000, 26000, 26001
          item.isEnabled = true;
      }
    });
    SetOwnedItems(array);
  };

  const onItemSelected = async (tokenId: string) => {
    //console.log("Selected tokendId::: ", tokenId);
    props.onItemSelected(tokenId);
    MakeDisabledItem(tokenId);
    DecreaseAmountOfToken(tokenId);
  };

  useEffect(() => {
    console.log("isDisableAll::::::: ", props.isDisableAll);
    if (props.isDisableAll) {
      let array = [...OwnedItems];
      array.forEach((item) => {
        item.isEnabled = false;
      });
      SetOwnedItems(array);
    }
  }, [props.isDisableAll]); //called when user remove item from Selection box

  function NextIcon(props: any) {
    const { className, style, onClick } = props;
    return (
      <button
        disabled={className?.includes("slick-disabled")}
        className={
          className +
          ` !flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 ${
            isDarkMode
              ? "bg-primary-pink hover:bg-primary-pink"
              : "bg-white hover:bg-white"
          } z-40 disabled:opacity-50`
        }
        style={{
          ...style,
          borderRadius: "50%",
        }}
        onClick={onClick}
      >
        <Icon
          path={mdiArrowRight}
          color={isDarkMode ? "white" : "black"}
          size={1}
        />
      </button>
    );
  }

  function PrevIcon(props: any) {
    const { className, style, onClick } = props;
    return (
      <button
        disabled={className?.includes("slick-disabled")}
        className={
          className +
          ` !flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 ${
            isDarkMode
              ? "bg-primary-pink hover:bg-primary-pink"
              : "bg-white hover:bg-white"
          } z-40 disabled:opacity-50`
        }
        style={{
          ...style,
          borderRadius: "50%",
        }}
        onClick={onClick}
      >
        <Icon
          path={mdiArrowLeft}
          color={isDarkMode ? "white" : "black"}
          size={1}
        />
      </button>
    );
  }

  return (
    <div className="slider-style">
      <div className="mx-auto overflow-hidden md:overflow-visible">
        {OwnedItems.length > 0 && (
          <Slider
            nextArrow={<NextIcon />}
            prevArrow={<PrevIcon />}
            {...SlilderSettings}
          >
            {OwnedItems.map((item) => (
              <ItemOfSlider
                tokenId={item.tokenId}
                amount={item.amount}
                isEnabled={item.isEnabled}
                key={item.tokenId}
                isDemantle={props.isDemantle}
                onItemSelected={onItemSelected}
              />
            ))}
          </Slider>
        )}
      </div>
    </div>
  );
};

export default SliderItems;
