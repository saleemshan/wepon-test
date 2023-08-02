import { useTheme } from "../../providers/ThemeContext";
import ItemOfSelected from "./ItemOfSelected";
import { ReactNode, useEffect, useState } from "react";
interface SelectedItemsProps {
  selectedItemsList: string[];
  onItemRemoved: Function;
  currentProgress: number;
  currentWeaponStatus: string;
}

const SelectedItems: React.FC<SelectedItemsProps> = (props) => {
  const { isDarkMode } = useTheme();
  const onItemRemoved = async (tokenId: string) => {
    //console.log("Removed tokendId::: ", tokenId);
    props.onItemRemoved(tokenId);
  };

  useEffect(() => {
    console.log("Current Progress: ", props.currentProgress);
  }, [props.currentProgress]);

  const DivBorder = ({ children }: { children: ReactNode }) => {
    return (
      <div
        className={`${
          isDarkMode ? "bg-card-wrapper-dark" : "bg-card-wrapper-light"
        }  bg-transparent bg-center bgCover w-full max-w-[753px] min-h-[468px]  p-8 gap-4 flex items-center`}
      >
        {children}
      </div>
    );
  };

  return (
    <div className="relative">
      {props?.selectedItemsList && props.currentWeaponStatus !== "loading" && (
        <div
          className={`${
            isDarkMode ? "bg-card-wrapper-dark" : "bg-card-wrapper-light"
          }  bg-transparent bg-center bgCover w-full max-w-[753px] min-h-[468px]  p-8 gap-4 flex items-start`}
        >
          <div className="flex flex-wrap items-start h-full gap-5">
            {props.selectedItemsList.map((item, i) => (
              <ItemOfSelected
                tokenId={item}
                key={item + i}
                onItemRemoved={onItemRemoved}
              />
            ))}
          </div>
        </div>
      )}

      {props.currentProgress > 0 && (
        
          <div className="flex items-center justify-center h-full w-full">
            <div className="bottom-0 lg:bottom-1/3 py-3 w-2/3 md:w-1/2 h-3/5 flex flex-col justify-center items-center rounded-xl progress-style bg-white font-Righteous text-black text-xl sm:text-2xl">
              <span>Processing...</span>
              <span>Transaction {props.currentProgress}/3</span>
              <div id="circularG">
                <div id="circularG_1" className="circularG"></div>
                <div id="circularG_2" className="circularG"></div>
                <div id="circularG_3" className="circularG"></div>
                <div id="circularG_4" className="circularG"></div>
                <div id="circularG_5" className="circularG"></div>
                <div id="circularG_6" className="circularG"></div>
                <div id="circularG_7" className="circularG"></div>
                <div id="circularG_8" className="circularG"></div>
              </div>
            </div>
          </div>
      )}
      {props.currentWeaponStatus === "loading" ? (
        <DivBorder>
        <div className="flex items-center justify-center h-full w-full">
          <div className="py-3 w-full max-w-[300px]   flex flex-col justify-center items-center rounded-xl bg-white font-inter text-dark text-xl sm:text-2xl">
            <div>
              <span>Loading weapons...</span>
            </div>
            <div id="circularG">
              <div id="circularG_1" className="circularG"></div>
              <div id="circularG_2" className="circularG"></div>
              <div id="circularG_3" className="circularG"></div>
              <div id="circularG_4" className="circularG"></div>
              <div id="circularG_5" className="circularG"></div>
              <div id="circularG_6" className="circularG"></div>
              <div id="circularG_7" className="circularG"></div>
              <div id="circularG_8" className="circularG"></div>
            </div>
          </div>
        </div>
        </DivBorder>
      ) : props.currentWeaponStatus === "no weapons" ? (
        <DivBorder>
        <div className="flex flex-col items-center justify-center h-full w-full">
          <h2
            className={`font-BebasNeue ${
              isDarkMode ? "text-white" : "text-dark"
            } md:text-[64px] md:leading-[57px] leading-[36px] text-[40px] font-normal text-center`}
          >
            You don&apos;t have any <br />
            Weapon
          </h2>
          <a
            className="btnPrimary rounded-xl mt-6 bg-primary-pink"
            href="https://opensea.io/collection/gfc-weapon-collection"
            target="_blank"
            rel="noreferrer noopener"
          >
            Purchase on OpenSea
          </a>
        </div>
        </DivBorder>
      ) : (
        <></>
      )}
    </div>
  );
};

export default SelectedItems;
