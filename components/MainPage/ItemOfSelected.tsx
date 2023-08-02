import Image from "next/image";
import SwordIcon from "../../assets/imgs/sword.png";
import CrossIcon from "../../assets/icons/crossIcon.svg";
import { useTheme } from "../../providers/ThemeContext";

interface ItemOfSelectedProps {
  tokenId: string;
  onItemRemoved: Function;
}

const ItemOfSelected: React.FC<ItemOfSelectedProps> = (props) => {
  const {isDarkMode} = useTheme()

  const getImageUrl = (item: any) => {
    try {
      if (parseInt(item) / 10000 < 3) {
        return `https://gfcmetaimage.blob.core.windows.net/weapons/images/${item}.png`
      } else {
        return `https://gfcmetaimage.blob.core.windows.net/p2e/images/${item}.png`
      }
    } catch(err) {
      return '';
    }
  }

  return (

<div className={`w-[143px] ${isDarkMode? "bg-card-dark": "bg-card-light"} h-[158px] bg-transparent p-4 bg-cover bg-center bgCover flex items-center justify-center relative`}>
       <img className="image-item disable-drag" 
          src={getImageUrl(props.tokenId)}
          key={props.tokenId}/>
      <div>
        <span className="absolute right-3 top-3">
          <Image onClick={() => props.onItemRemoved(props.tokenId)} alt="closeIcon"  src={CrossIcon} />
        </span>
      </div>
    </div>
  );
};

export default ItemOfSelected;


