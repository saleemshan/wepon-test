import React from "react";
import Image from "next/image";
import SwordIcon from "../../assets/imgs/sword.png";
import CrossIcon from "../../assets/icons/crossIcon.svg";

const ImageCard = () => {
  return (
    <div className="w-[143px] bg-card-dark h-[158px] bg-transparent p-4 bg-cover bg-center bgCover flex items-center justify-center relative">
      <Image src={SwordIcon} alt="" />
      <div>
        <span className="absolute right-3 top-3">
          <Image src={CrossIcon} alt="" />
        </span>
      </div>
    </div>
  );
};

export default ImageCard;
