import { ReactNode, useState } from "react";

import { useTheme } from "../providers/ThemeContext";

const AppLayout = ({ children }: {children:ReactNode}) => {
  const { isDarkMode } = useTheme();
  return (
    <div
      className={`${
        isDarkMode ? "bg-hero-dark" : "bg-hero-light"
      } bg-cover bg-center h-[100%] min-h-screen bg-fixed`}
    >
      {children}
    </div>
  );
};

export default AppLayout;
