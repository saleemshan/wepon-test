module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        Righteous: ["Righteous", "sans-serif"],
        BebasNeue: ["Bebas Neue", "sans-serif"],
        inter: ["Inter", "sans-serif"],
      },
      backgroundColor:{
        "dark-primary":"rgba(255, 255, 255, 0.10)",
      },
      backgroundImage: {
        "hero-light": "url('../assets/imgs/bgLight.png')",
        "hero-dark": "url('../assets/imgs/BgDark.png')",
        'card-light': "url('../assets/imgs/bgCard.png')",
        'card-dark': "url('../assets/imgs/bgCardDark.png')",
        "card-wrapper-light":"url('../assets/imgs/cardWrapperLight.png')",
        "card-wrapper-dark":"url('../assets/imgs/CardWrapperDark.png')",
        'bg-polygon':"url('../assets/icons/PolygonBg.svg')"
      },
      colors: {
        primary: {
          dark: "#231D5D",
          purple: "#7054A1",
          pink: "#ED4799",
          green: "#00BAB9",
          "light-green": "#92D2C2",
          white: "#FFFFFF",
        },
        dark: "#111121",
      },
    },
  },
  plugins: [],
};
