interface ForgedItemsProps {
  forgedItemsList: any[];
  rewardItemsList: any[];
  returnClicked: Function;
}

const ForgedItems: React.FC<ForgedItemsProps> = (props) => {
  const getImageUrl = (item: any) => {
    try {
      if (parseInt(item) / 10000 < 3) {
        return `https://gfcmetaimage.blob.core.windows.net/weapons/images/${item}.png`;
      } else {
        return `https://gfcmetaimage.blob.core.windows.net/p2e/images/${item}.png`;
      }
    } catch (err) {
      return "";
    }
  };
  return (
    <div className="lg:basis-1/2 lg:w-1/2 w-4/6 h-full forged-items overflow-y-auto z-20">
      <div className="relative">
        <div className="flex justify-center">
          <span className="font-Righteous text-white text-base lg:text-3xl">
            Congratulations! You obtained the following item(s)!
          </span>
        </div>
        <div className="flex justify-center px-4 w-full mx-auto pt-5 forged-token">
          {props.forgedItemsList.map((item, i) => (
            <div className="px-1 md:px-3 w-full flex justify-center" key={item}>
              <img
                className="image-item forged-image disable-drag"
                src={getImageUrl(item)}
              />
            </div>
          ))}
          {props.rewardItemsList.map((item, i) => (
            <div className="px-1 md:px-3 w-full flex justify-center" key={item}>
              <img
                className="image-item forged-image disable-drag"
                src={getImageUrl(item)}
              />
            </div>
          ))}
        </div>
        <div className="flex justify-center lg:mt-5 mt-8 return-div">
          <button
            className="text-black text-base lg:text-2xl confirm-btn return-btn"
            onClick={() => props.returnClicked()}
          >
            Back to Main Menu
          </button>
        </div>
      </div>
    </div>
  );
};

export default ForgedItems;
