"use client";

import { useState, useEffect } from "react";

const useScreenDimensions = () => {
  const [screenDimensions, setScreenDimensions] = useState({
    width: 0,
    height: 0,
  });

  useEffect(() => {
    const handleResize = () => {
      setScreenDimensions({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    window.addEventListener("resize", handleResize);

    // Limpeza do listener no desmontagem do componente
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return screenDimensions;
};

export default useScreenDimensions;
