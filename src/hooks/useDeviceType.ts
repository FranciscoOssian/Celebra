import { useState, useEffect } from "react";

const useDeviceType = () => {
  const [deviceType, setDeviceType] = useState("desktop");

  const getDeviceType = () => {
    const width = window.innerWidth;
    if (width < 768) return "mobile";
    if (width >= 768 && width < 1024) return "tablet";
    return "desktop";
  };

  useEffect(() => {
    const handleResize = () => {
      setDeviceType(getDeviceType());
    };

    handleResize(); // set initial value
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return deviceType as "desktop" | "mobile" | "tablet";
};

export default useDeviceType;
