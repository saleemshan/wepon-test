import React from "react";
import { useTheme } from "../providers/ThemeContext";
import ImageCard from "./MainPage/ImageCard";

const SelectedIcon = () => {
  const { isDarkMode } = useTheme();
  return (
    // <div className={`${isDarkMode ? "bg-card-wrapper-dark":"bg-card-wrapper-light"}  bg-transparent bg-center bgCover w-full max-w-[753px] min-h-[468px] flex flex-wrap p-8  gap-4 items-start`}>

    <div className="forgeKnifeWrapper parallelogram-container  w-full max-w-[753px] min-h-[468px]">
      <div className="parallelogram h-full w-full"></div>
      <div className="small-parallelogram flex flex-wrap p-8 gap-4 items-start">
        {Array(6)
          .fill("")
          .map((_item, index) => {
            return <ImageCard key={index} />;
          })}
      </div>
    </div>
  );
};

export default SelectedIcon;
