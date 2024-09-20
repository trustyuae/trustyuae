import { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";

// Custom hook to store the previous location
export const usePreviousLocation = () => {
  const location = useLocation();
  const prevLocationRef = useRef();

  useEffect(() => {
    prevLocationRef.current = location;
  }, [location]);

  return prevLocationRef.current;
};