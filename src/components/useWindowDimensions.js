import React from 'react';
  
  const UseWindowDimensions = () =>  {
	return (
	  <div>
	  </div>
	);
  }
  
  export default UseWindowDimensions;
  import { useState, useEffect } from "react";

export const useWindowDimensions = () => {
  const [dimensions, setDimensions] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  useEffect(() => {
    const handleResize = () => {
      setDimensions({ width: window.innerWidth, height: window.innerHeight });
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return dimensions;
};

