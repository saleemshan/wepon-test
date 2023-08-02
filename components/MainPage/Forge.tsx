import { useEffect, useState } from "react";
import Image from "next/image";
import { useWeb3React } from "@web3-react/core";
import cn from "classnames";
import Swal from "sweetalert2";
import Web3 from "web3";


import Icon from '@mdi/react';
import { mdiArrowLeft } from '@mdi/js';
//icons
import PolygonFill from "../../assets/icons/polygonfill.svg";
import Polygon from "../../assets/icons/Polygon.svg";
import coinIcon from "../../assets/icons/coinIcon.svg";
import { useTheme } from "../../providers/ThemeContext";

interface ForgeProps {
  isRed: boolean;
  isDemantleValid: boolean;
  account: any;
  setTabIndex: any;
  tabIndex: number;
  connectedNetwork: string;
  selectedItemsList: string[];
  currentForgeCost: string[];
  onForgingSuccess: Function;
  SetCurrentProgressOfForging: Function;
  onForgingStarted: Function;
  SetTransactionId: Function;
  setForgedItemsList: any;
}

interface ParamType {
  category: number;
  tier: number;
  amounts: number[];
}

const Forge: React.FC<ForgeProps> = (props) => {
  const { library } = useWeb3React();
  const { isDarkMode } = useTheme();

  const provider = library?._provider;
  const web3 = new Web3(provider);

  let intervalID: NodeJS.Timer;

  const requiredForgeCost =
    props.selectedItemsList.length === 0
      ? 0
      : Number(
          props.currentForgeCost[
            Number(props.selectedItemsList[0].toString().charAt(1))
          ]
        );

  useEffect(() => {
    if (props.account) CheckBeforeForging();
  }, [props.account, props.connectedNetwork]);

  const CheckBeforeForging = async () => {
    // Check if the random number already generated
    if (typeof window !== "undefined" && !provider) return;

    // const provider = window.ethereum;
    // const web3 = new Web3(provider);

    const GFCBlackSmith_CONTRACT = require("../../constants/GFCBlackSmith_Contract.json");
    const GFCBlackSmith_ContractAddress = GFCBlackSmith_CONTRACT.MainNetAddress;
    const GFCBlackSmithContract = new web3.eth.Contract(
      GFCBlackSmith_CONTRACT.ABI,
      GFCBlackSmith_ContractAddress
    );

    GFCBlackSmithContract.methods
      .getResult(props.account)
      .call()
      .then((result: any) => {
        console.log("getResult::::::: ", result); //Already rolled
        props.onForgingStarted();
        props.SetCurrentProgressOfForging(2);
        Swal.fire({
          icon: "info",
          title: "Random Number already exist!",
          text: "You already generated random number last time! You will forge weapon from the last selection.",
        });
        ProcSmith(GFCBlackSmithContract, props.account);
      })
      .catch((err: any) => {
        console.log(" getResult catch1::::::: ", err);
        if (err.message.includes("Roll in progress")) {
          // Generating a random number
          props.onForgingStarted();
          props.SetCurrentProgressOfForging(2);
          Swal.fire({
            icon: "info",
            title: "Already requested Random Number!",
            text: "You already requested to generate random number last time! You will forge weapon from the last selection.",
          });
          RunSmith(GFCBlackSmithContract, props.account);
        }
      });
  };

  function RunSmith(GFCBlackSmithContract: any, account: any) {
    intervalID = setInterval(
      ProcSmith,
      1000 * 30,
      GFCBlackSmithContract,
      account
    ); //call ProcSmith after 30sec
    console.log("intervalID::::: ", intervalID);
  }

  function GetParamForForgeWeapon(selectedItemsList: string[]) {
    //Initalise the total number of weapons
    let meleeWeaponCount = [0, 3, 2, 2, 3, 2, 1, 1, 1];
    let rangedWeaponCount = [0, 2, 4, 11, 6, 6, 2, 1, 1];

    let val: ParamType = { category: 0, tier: 0, amounts: [] };
    val.category = Number(selectedItemsList[0].charAt(0));
    val.tier = Number(selectedItemsList[0].charAt(1));

    if (val.category === 1) {
      //melee weapon
      for (let i = 0; i < meleeWeaponCount[val.tier]; i++) {
        val.amounts.push(0);
      }
    } else if (val.category === 2) {
      //ranged weapon
      for (let i = 0; i < rangedWeaponCount[val.tier]; i++) {
        val.amounts.push(0);
      }
    }

    const amounts: any = {
      0: 0,
      1: 0,
      2: 0,
      3: 0,
      4: 0,
      5: 0,
      6: 0,
      7: 0,
      8: 0,
      9: 0,
    };

    selectedItemsList.map((item: any) => {
      amounts[Number(item.toString().slice(2))] =
        (amounts[Number(item.toString().slice(2))] || 0) + 1;
    });
    val.amounts = Object.values(amounts);
    return val;
  }

  function ProcSmith(GFCBlackSmithContract: any, account: any) {
    console.log("after 30sec , ProcSmith() ==> intervalID::: ", intervalID);
    GFCBlackSmithContract.methods
      .getResult(account)
      .call()
      .then((result: number) => {
        console.log("Chainlink VRF result: " + result);
        clearInterval(intervalID);
        if (result > 0) {
          console.log("chainlink VRF callbacked!");
          props.SetCurrentProgressOfForging(3);

          let gas_fee = 22222222222; //Wei
          web3.eth
            .getGasPrice(function (e, r) {
              console.log("=========== old gas fee: ", r);
              gas_fee = Number(r) * 3;
              console.log("=========== new gas fee: ", gas_fee);

              let rand_hex: string = web3.utils.randomHex(32);
              let rand_num: string = web3.utils.hexToNumberString(rand_hex);
              props.SetTransactionId(rand_num);
              console.log("=== ", rand_num, " ===");

              GFCBlackSmithContract.methods
                .smith(rand_num)
                .send({ from: props.account, gasPrice: gas_fee.toFixed() })
                .on("receipt", function (receipt: any) {
                  //socket event will be happen before this 'receipt' occur
                  console.log("smith() called");
                  console.log(receipt);
                  props.onForgingSuccess();
                })
                .on("error", function (error: any, receipt: any) {
                  // If the transaction was rejected by the network with a receipt, the second parameter will be the receipt.
                  console.log(error);
                  console.log(error.message);
                  console.log(receipt);
                  Swal.fire({
                    icon: "error",
                    title: "Oops...",
                    text: `Transaction failed`,
                  });
                  props.SetCurrentProgressOfForging(0);
                });
            })
            .catch((err: any) => {
              console.log(err);
              Swal.fire({
                icon: "error",
                title: "Oops...",
                text: `Can not get the gas fee!`,
              });
            });
        }
      })
      .catch((err: any) => {
        console.log(err);
        console.log("getResult() will be called after 30sec");
      });
  }

  const CheckRandomAndDoSmith = (GFCBlackSmithContract: any) => {
    GFCBlackSmithContract.methods
      .getResult(props.account)
      .call()
      .then((result: any) => {
        console.log("getResult::::::: ", result); //Already rolled
        props.SetCurrentProgressOfForging(2);
        ProcSmith(GFCBlackSmithContract, props.account);
      })
      .catch((err: any) => {
        console.log(" getResult catch2::::::: ", err);
        if (
          err.message.includes("Roll in progress") || // Generating a random number
          err.message.includes("Dice not rolled")
        ) {
          //   Sometimes in the Mainnet, this fuction will be called earlier than getRandNum4Forge() in the contract
          props.SetCurrentProgressOfForging(2);
          RunSmith(GFCBlackSmithContract, props.account);
        }
      });
  };

  const DoForging = async (GFCBlackSmithContract: any) => {
    props.SetCurrentProgressOfForging(1);
    let gas_fee = 22222222222; //Wei

    console.log("props:", props);
    web3.eth
      .getGasPrice(function (e, r) {
        console.log("=========== old gas fee: ", r);
        gas_fee = Number(r) * 3;
        console.log("=========== new gas fee: ", gas_fee);

        GFCBlackSmithContract.methods
          .getResult(props.account)
          .call()
          .then((result: any) => {
            console.log("getResult::::::: ", result); //Already rolled
            Swal.fire({
              icon: "info",
              title: "Random Number already exist!",
              text: "You already generated random number last time! You will forge weapon from the last selection.",
            });
            props.SetCurrentProgressOfForging(2);
            ProcSmith(GFCBlackSmithContract, props.account);
          })
          .catch((err: any) => {
            console.log(" getResult catch3::::::: ", err);
            if (err.message.includes("Roll in progress")) {
              // Generating a random number
              props.SetCurrentProgressOfForging(2);
              Swal.fire({
                icon: "info",
                title: "Already requested Random Number!",
                text: "You already requested to generate random number last time! You will forge weapon from the last selection.",
              });
              RunSmith(GFCBlackSmithContract, props.account);
            } else {
              //If Dice not rolled do normal forging
              let param: ParamType = GetParamForForgeWeapon(
                props.selectedItemsList
              );
              console.log("Param ::: ", param);

              if (
                props.selectedItemsList.includes("16000") &&
                props.selectedItemsList.includes("26000") &&
                props.selectedItemsList.includes("26001")
              ) {
                GFCBlackSmithContract.methods
                  .forgeAsteroids()
                  .send({ from: props.account, gasPrice: gas_fee.toFixed() })
                  .on("receipt", function (receipt: any) {
                    //socket event will be happen before this 'receipt' occur
                    console.log("forgeAsteroids called");
                    console.log(receipt);
                    CheckRandomAndDoSmith(GFCBlackSmithContract);
                  })
                  .on("error", function (error: any, receipt: any) {
                    // If the transaction was rejected by the network with a receipt, the second parameter will be the receipt.
                    console.log(error);
                    console.log(error.message);
                    console.log(receipt);
                    Swal.fire({
                      icon: "error",
                      title: "Oops...",
                      text: `Transaction failed`,
                    });
                    props.SetCurrentProgressOfForging(0);
                  });
              } else if (
                props.selectedItemsList.includes("13001") ||
                props.selectedItemsList.includes("24005")
              ) {
                GFCBlackSmithContract.methods
                  .forgeWithOGWeapon(param.category, param.amounts)
                  .send({ from: props.account, gasPrice: gas_fee.toFixed() })
                  .on("receipt", function (receipt: any) {
                    //socket event will be happen before this 'receipt' occur
                    console.log("forgeWithOGWeapon called");
                    console.log(receipt);
                    CheckRandomAndDoSmith(GFCBlackSmithContract);
                  })
                  .on("error", function (error: any, receipt: any) {
                    // If the transaction was rejected by the network with a receipt, the second parameter will be the receipt.
                    console.log(error);
                    console.log(error.message);
                    console.log(receipt);
                    Swal.fire({
                      icon: "error",
                      title: "Oops...",
                      text: `Transaction failed`,
                    });
                    props.SetCurrentProgressOfForging(0);
                  });
              } else {
                console.log("param: ", param);
                GFCBlackSmithContract.methods
                  .forgeWeapon(param.category, param.tier, param.amounts)
                  .send({ from: props.account, gasPrice: gas_fee.toFixed() })
                  .on("receipt", function (receipt: any) {
                    //socket event will be happen before this 'receipt' occur
                    console.log("forgeWeapon called");
                    console.log(receipt);
                    CheckRandomAndDoSmith(GFCBlackSmithContract);
                  })
                  .on("error", function (error: any, receipt: any) {
                    // If the transaction was rejected by the network with a receipt, the second parameter will be the receipt.
                    console.log(error);
                    console.log(receipt);
                    Swal.fire({
                      icon: "error",
                      title: "Oops...",
                      text: `Transaction failed`,
                    });
                    props.SetCurrentProgressOfForging(0);
                  });
              }
            }
          });
      })
      .catch((err: any) => {
        console.log(err);
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: `Can not get the gas fee!`,
        });
        props.SetCurrentProgressOfForging(0);
      });
  };

  const ConfirmForging = async () => {
    if (typeof window !== "undefined" && !provider) return;
    console.log(props.connectedNetwork);
    props.onForgingStarted();
    const GCOIN_CONTRACT = require("../../constants/GCOIN_Contract.json");
    const GCOIN_ContractAddress =
      props.connectedNetwork === "Polygon mainnet"
        ? GCOIN_CONTRACT.MainNetAddress
        : GCOIN_CONTRACT.TestNetAddress;
    const GCOINContract = new web3.eth.Contract(
      GCOIN_CONTRACT.ABI,
      GCOIN_ContractAddress
    );

    const GFCBlackSmith_CONTRACT = require("../../constants/GFCBlackSmith_Contract.json");
    const GFCBlackSmith_ContractAddress =
      props.connectedNetwork === "Polygon mainnet"
        ? GFCBlackSmith_CONTRACT.MainNetAddress
        : GFCBlackSmith_CONTRACT.TestNetAddress;
    const GFCBlackSmithContract = new web3.eth.Contract(
      GFCBlackSmith_CONTRACT.ABI,
      GFCBlackSmith_ContractAddress
    );

    try {
      let result: string = await GCOINContract.methods
        .balanceOf(props.account)
        .call(); //Get GCOIN balance from account
      let GCOIN_balance = Web3.utils.fromWei(result.toString(), "ether");
      console.log("GCOIN balance: ", GCOIN_balance, "GCOIN");
    } catch (error) {
      console.error(error);
      return;
    }

    GCOINContract.methods
      .allowance(props.account, GFCBlackSmith_ContractAddress) //Get spendable GCOIN from account for GFCBlackSmith Contract
      .call()
      .then((result: string) => {
        let GCOIN_result = Web3.utils.fromWei(result.toString(), "ether");
        console.log("spendable GCOIN: ", GCOIN_result, "GCOIN");
        if (Number(GCOIN_result) < requiredForgeCost) {
          web3.eth
            .getGasPrice(function (e, r) {
              let gas_fee = 22222222222; //Wei
              console.log("=========== old gas fee: ", r);
              gas_fee = Number(r) * 3;
              console.log("=========== new gas fee: ", gas_fee);

              GCOINContract.methods
                .increaseAllowance(
                  GFCBlackSmith_ContractAddress,
                  "1000000000000000000000000"
                ) // increase the allowance of 1000000GCOIN.    1000000000000000000000000 = 1000000*10^18
                .send({ from: props.account })
                .then((result: string) => {
                  console.log("result: ", result);
                  DoForging(GFCBlackSmithContract);
                  // Swal.fire({
                  //   icon: 'info',
                  //   title: 'Notice',
                  //   text: `You have increased allowance, Please press forge button again!`,
                  // })
                })
                .catch((err: any) => {
                  console.error("error:::", err);
                  Swal.fire({
                    icon: "error",
                    title: "Oops...",
                    text: `Failed to increase allowance!`,
                  });
                });
            })
            .catch((err: any) => {
              console.log(err);
              Swal.fire({
                icon: "error",
                title: "Oops...",
                text: `Can not get the gas fee!`,
              });
              props.SetCurrentProgressOfForging(0);
            });
        } else {
          DoForging(GFCBlackSmithContract);
        }
      })
      .catch((err: any) => {
        console.error(err);
      });
  };

  const DoDemantle = async (GFCBlackSmithContract: any) => {
    props.SetCurrentProgressOfForging(1);
    let gas_fee = 22222222222; //Wei

    console.log("props:", props);
    web3.eth
      .getGasPrice(function (e, r) {
        console.log("=========== old gas fee: ", r);
        gas_fee = Number(r) * 3;
        console.log("=========== new gas fee: ", gas_fee);

        GFCBlackSmithContract.methods
          .getResult(props.account)
          .call()
          .then((result: any) => {
            console.log("getResult::::::: ", result); //Already rolled
            Swal.fire({
              icon: "info",
              title: "Random Number already exist!",
              text: "You already generated random number last time! You will forge weapon from the last selection.",
            });
            props.SetCurrentProgressOfForging(2);
            ProcSmith(GFCBlackSmithContract, props.account);
          })
          .catch((err: any) => {
            console.log(" getResult catch3::::::: ", err);
            if (err.message.includes("Roll in progress")) {
              // Generating a random number
              props.SetCurrentProgressOfForging(2);
              Swal.fire({
                icon: "info",
                title: "Already requested Random Number!",
                text: "You already requested to generate random number last time! You will forge weapon from the last selection.",
              });
              RunSmith(GFCBlackSmithContract, props.account);
            } else {
              //If Dice not rolled do normal forging
              let param: ParamType = GetParamForForgeWeapon(
                props.selectedItemsList
              );

              GFCBlackSmithContract.methods
                .forgeReverse(props.selectedItemsList[0])
                .send({ from: props.account, gasPrice: gas_fee.toFixed() })
                .on("receipt", function (receipt: any) {
                  //socket event will be happen before this 'receipt' occur
                  console.log("forgeWeapon called");
                  console.log(receipt);
                  CheckRandomAndDoSmith(GFCBlackSmithContract);
                })
                .on("error", function (error: any, receipt: any) {
                  // If the transaction was rejected by the network with a receipt, the second parameter will be the receipt.
                  console.log(error);
                  console.log(receipt);
                  Swal.fire({
                    icon: "error",
                    title: "Oops...",
                    text: `Transaction failed`,
                  });
                  props.SetCurrentProgressOfForging(0);
                });
            }
          });
      })
      .catch((err: any) => {
        console.log(err);
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: `Can not get the gas fee!`,
        });
        props.SetCurrentProgressOfForging(0);
      });
  };

  const ConfirmDemantle = async () => {
    if (typeof window !== "undefined" && !provider) return;
    console.log(props.connectedNetwork);
    props.onForgingStarted();
    const GCOIN_CONTRACT = require("../../constants/GCOIN_Contract.json");
    const GCOIN_ContractAddress =
      props.connectedNetwork === "Polygon mainnet"
        ? GCOIN_CONTRACT.MainNetAddress
        : GCOIN_CONTRACT.TestNetAddress;
    const GCOINContract = new web3.eth.Contract(
      GCOIN_CONTRACT.ABI,
      GCOIN_ContractAddress
    );

    const GFCBlackSmith_CONTRACT = require("../../constants/GFCBlackSmith_Contract.json");
    const GFCBlackSmith_ContractAddress =
      props.connectedNetwork === "Polygon mainnet"
        ? GFCBlackSmith_CONTRACT.MainNetAddress
        : GFCBlackSmith_CONTRACT.TestNetAddress;
    const GFCBlackSmithContract = new web3.eth.Contract(
      GFCBlackSmith_CONTRACT.ABI,
      GFCBlackSmith_ContractAddress
    );

    try {
      let result: string = await GCOINContract.methods
        .balanceOf(props.account)
        .call(); //Get GCOIN balance from account
      let GCOIN_balance = Web3.utils.fromWei(result.toString(), "ether");
      console.log("GCOIN balance: ", GCOIN_balance, "GCOIN");
    } catch (error) {
      console.error(error);
      return;
    }

    const requiredDemantleCost = [0, 0, 0, 0, 400, 800, 1600, 3200, 6400];
    console.log(
      "requiredDemantleCost: ",
      requiredDemantleCost[
        Number(props.selectedItemsList[0].toString().charAt(1))
      ]
    );

    GCOINContract.methods
      .allowance(props.account, GFCBlackSmith_ContractAddress) //Get spendable GCOIN from account for GFCBlackSmith Contract
      .call()
      .then((result: string) => {
        let GCOIN_result = Web3.utils.fromWei(result.toString(), "ether");
        console.log("spendable GCOIN: ", GCOIN_result, "GCOIN");
        if (
          Number(GCOIN_result) <
          requiredDemantleCost[
            Number(props.selectedItemsList[0].toString().charAt(1))
          ]
        ) {
          web3.eth
            .getGasPrice(function (e, r) {
              let gas_fee = 22222222222; //Wei
              console.log("=========== old gas fee: ", r);
              gas_fee = Number(r) * 3;
              console.log("=========== new gas fee: ", gas_fee);

              GCOINContract.methods
                .increaseAllowance(
                  GFCBlackSmith_ContractAddress,
                  "1000000000000000000000000"
                ) // increase the allowance of 1000000GCOIN.    1000000000000000000000000 = 1000000*10^18
                .send({ from: props.account })
                .then((result: string) => {
                  console.log("result: ", result);
                  DoDemantle(GFCBlackSmithContract);
                  // Swal.fire({
                  //   icon: 'info',
                  //   title: 'Notice',
                  //   text: `You have increased allowance, Please press forge button again!`,
                  // })
                })
                .catch((err: any) => {
                  console.log("error: ", err);
                  Swal.fire({
                    icon: "error",
                    title: "Oops...",
                    text: `Failed to increase allowance!`,
                  });
                });
            })
            .catch((err: any) => {
              console.log(err);
              Swal.fire({
                icon: "error",
                title: "Oops...",
                text: `Can not get the gas fee!`,
              });
              props.SetCurrentProgressOfForging(0);
            });
        } else {
          DoDemantle(GFCBlackSmithContract);
        }
      })
      .catch((err: any) => {
        console.error(err);
      });
  };

  const forgeKey = [
    "Basic",
    "Common",
    "Uncommon",
    "Rare",
    "Epic",
    "Legendary",
    "Mythic",
  ];

  const dismantleKeys = ["Rare", "Epic", "Legendary", "Mythic", "Exotic"];

  const forgeClassNames = `${
    props.isRed ? "forge-btn-red cursor-pointer " : ""
  }forge-btn`;
  const demantleClassNames = `${
    props.isDemantleValid ? "demantle-btn-red cursor-pointer " : ""
  }demantle-btn`;

  return (
    <div
      className={`max-w-[417px] w-full  bgForgeCard ${
        !isDarkMode ? "!bg-white" : "backdrop-blur-[15px]"
      } mx-auto p-5 pb-8 rounded-xl shadow-lg`}
    >
      <div
        className={`flex rounded-[10px] justify-center items-center text-[#AAAAC8] uppercase text-sm font-inter font-bold ${
          isDarkMode ? "bg-[#ffffff1a]" : "bg-[#F0F0F3]"
        }  `}
      >
        <span
          className={cn(
            "text-white text-forge w-1/2 text-center py-3 cursor-pointer",
            props.tabIndex === 0
              ? "bg-primary-pink rounded-[10px]"
              : "text-[#AAAAC8]"
          )}
          onClick={() => {
            props.setTabIndex(0);
          }}
        >
          Forge
        </span>
        <span
          className={cn(
            "text-white text-forge w-1/2 text-center py-3 cursor-pointer",
            props.tabIndex === 1
              ? "bg-primary-pink rounded-[10px]"
              : "text-[#AAAAC8]"
          )}
          onClick={() => {
            props.setTabIndex(1);
          }}
        >
          Dismantle
        </span>
      </div>
      {props.tabIndex === 0 && (
        <>
          <div
            className={`flex rounded-xl py-6 items-center ${
              isDarkMode ? "text-white" : "text-dark"
            } text-white`}
          >
            <Image
              className="cursor-pointer"
              src={props.isRed ? PolygonFill : Polygon}
              onClick={() => {
                props.isRed && ConfirmForging();
              }}
              alt=""
            />
            <span className="ml-3 font-BebasNeue text-[32px]">
              Current forge cost
            </span>
          </div>
          <div
            className={`flex flex-col gap-y-6 ${
              isDarkMode ? "text-white" : "text-dark"
            }`}
          >
            {forgeKey.map((item, index) => {
              return (
                <div
                  className="flex justify-between items-center font-inter text-sm font-semibold"
                  key={index}
                >
                  <span className="text-[#8E8EB3] uppercase">{item}</span>
                  <span className="flex items-center gap-x-2">
                    <Image src={coinIcon} alt="" />
                    {props.currentForgeCost[index]} GCOIN
                  </span>
                </div>
              );
            })}
          </div>
        </>
      )}
      {props.tabIndex === 1 && (
        <>
          <div
            className={`flex rounded-xl py-6 items-center ${
              isDarkMode ? "text-white" : "text-dark"
            } text-white`}
          >
            <Image
              src={props.isRed ? PolygonFill : Polygon}
              onClick={() => {
                window.localStorage.removeItem("forgedList");
                props.isDemantleValid && ConfirmDemantle();
              }}
              alt=""
            />
            <span className="ml-3 font-BebasNeue text-[32px]">
              Current dismantle cost
            </span>
          </div>

          <div
            className={`flex flex-col gap-y-6 ${
              isDarkMode ? "text-white" : "text-dark"
            }`}
          >
            {dismantleKeys.map((item, index) => {
              return (
                <div
                  className="flex justify-between items-center font-inter text-sm font-semibold"
                  key={index}
                >
                  <span className="text-[#8E8EB3] uppercase">{item}</span>
                  <span className="flex items-center gap-x-2">
                    <Image className="cursor-pointer" src={coinIcon} alt="" />
                    {props.currentForgeCost[index]} GCOIN
                  </span>
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
};

export default Forge;
