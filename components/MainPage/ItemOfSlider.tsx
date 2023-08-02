import { useTheme } from "../../providers/ThemeContext";

interface ItemOfSliderProps {
  tokenId: any;
  amount: Number;
  isEnabled: boolean;
  isDemantle: boolean;
  onItemSelected: Function;
}

const ItemOfSlider: React.FC<ItemOfSliderProps> = (props) => {
  const {isDarkMode} = useTheme()
  const classNames = `${
    props.isEnabled ? "cursor-pointer" : "opacity-[0.2]"
  } image-item`;
  const getImageUrl = () => {
    try {
      if (parseInt(props.tokenId) / 10000 < 3) {
        return `https://gfcmetaimage.blob.core.windows.net/weapons/images/${props.tokenId}.png`;
      } else {
        return `https://gfcmetaimage.blob.core.windows.net/p2e/images/${props.tokenId}.png`;
      }
    } catch (err) {
      return "";
    }
  };

  const tier = Number(Number(props.tokenId).toString().charAt(1));

  return (
    <div
      className={
        props.isDemantle && tier < 4
          ? "relative grayscale  pointer-events-none"
          : `relative `
      }
    >
      <div className={`${isDarkMode ? "bgSliderDark" :"bg-card-light" }  bg-cover bg-center bgCover w-[123px] h-[158px] sm:w-[216px] sm:h-[280px] px-3 sm:px-8 flex items-center justify-center relative ${!props.isEnabled && "grayscale"} `}>
        <img
          className={classNames}
          src={getImageUrl()}
          key={props.tokenId}
          onClick={() => {
            props.isEnabled && props.onItemSelected(props.tokenId);
          }}
        />
      </div>

      <div className={`bg-bg-polygon ${!props.isEnabled && "grayscale"} flex items-center justify-center absolute font-bold font-inter text-[16px] text-white top-[10px] right-[10px] md:top-4 md:right-4 w-[38px] h-[38px] bg-cover bg-center bgCover`}>{props.amount}</div>
    </div>
  );
};

export default ItemOfSlider;
