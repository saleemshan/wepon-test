import { useEffect, useState, useLayoutEffect } from "react";
import { useTheme } from "../../providers/ThemeContext";

interface AddPolygonProps {
  swtichToPolygon: Function;
}

const AddPolygon: React.FC<AddPolygonProps> = (props) => {
  const { isDarkMode } = useTheme();
  return (
    <div
      className={`${
        isDarkMode ? "bg-card-wrapper-dark" : "bg-card-wrapper-light"
      }  bg-transparent bg-center bgCover w-full max-w-[753px] min-h-[468px] p-8 flex flex-col justify-center   items-center`}
    >
      <div className={`font-BebasNeue ${isDarkMode ? "text-white" : "text-dark"} md:text-[54px] leading-[57px] text-[40px] text-center`}>
        In order to use the forging system, <br />
        you will have to be on the Polygon network
      </div>
      <button
        className="btnPrimary rounded-xl mt-6 bg-primary-pink"
        onClick={() => props.swtichToPolygon()}
      >
        Add Polygon network
      </button>
    </div>
  );
};

export default AddPolygon;
