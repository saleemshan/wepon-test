import React, { useState, useEffect } from "react";

const useScreenSize = () => {
  const [screenSize, setScreenSize] = useState<"large"|"small"|"medium" >("large");

  const checkScreenSize = () => {
    const { innerWidth } = window;

    if (innerWidth < 768) {
      setScreenSize("small");
    } else if (innerWidth >= 768 && innerWidth < 1024) {
      setScreenSize("medium");
    } else {
      setScreenSize("large");
    }
  };

  useEffect(() => {
    checkScreenSize();

    const handleResize = () => {
      checkScreenSize();
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return screenSize;
};

export default useScreenSize;
