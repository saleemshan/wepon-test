import Head from "next/head";
import Script from "next/script";
import DiscordIcon from "../../assets/imgs/DiscordIcon.svg";
import TwitterIcon from "../../assets/imgs/TwitterIcon.svg";
import OpenseaIcon from "../../assets/imgs/OpenseaIcon.svg";
import Image from "next/image";

interface FooterProps {}

declare global {
  interface Window {
    logBadgeClick: any;
  }
}

const Footer: React.FC<FooterProps> = () => {
  return (
    <div className="footer-container">
      <Head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
                const BADGE_ID = '83b768e6c3cb4a1f';
                    `,
          }}
        ></script>
      </Head>
      <Script
        type="text/javascript"
        src="https://static.alchemyapi.io/scripts/analytics/badge-analytics.js"
      />
      <a
        href="https://twitter.com/GalaxyFight_NFT"
        target="_blank"
        rel="noreferrer"
      >
        <Image
          className=""
          alt="Twitter Image"
          src={TwitterIcon}
          width={24}
          height={24}
        />
      </a>
      <a
        href="https://opensea.io/category/galaxyfightclub"
        target="_blank"
        rel="noreferrer"
      >
        <Image
          className=""
          alt="Opensea Image"
          src={OpenseaIcon}
          width={24}
          height={24}
        />
      </a>
      <a
        href="https://discord.com/invite/tbhXh5bYRG"
        target="_blank"
        rel="noreferrer"
      >
        <Image
          className=""
          alt="Discord Image"
          src={DiscordIcon}
          width={24}
          height={24}
        />
      </a>
      <a href="#">
        <img
          onClick={() => window.logBadgeClick()}
          id="badge-button"
          style={{ width: 240, height: 53 }}
          src="https://static.alchemyapi.io/images/marketing/badge.png"
          alt="Alchemy Supercharged"
        />
      </a>
      <a href="https://chn.lk/3C1ffBV">
        {" "}
        <img
          src="https://chain.link/badge-randomness-black"
          alt="randomness secured with chainlink"
          style={{ width: 200, height: 53 }}
        />
      </a>
    </div>
  );
};

export default Footer;
