// components/AOSWrapper.js
"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

const AOSInitializer = () => {
  useEffect(() => {
    let active = true;

    void import("aos").then(({ default: AOS }) => {
      if (active) {
        AOS.init({ duration: 1200 });
      }
    });

    return () => {
      active = false;
    };
  }, []);

  return null;
};

const AOSWrapper = ({ children }) => {
  const pathname = usePathname();

  return (
    <>
      {pathname === "/" ? null : <AOSInitializer />}
      {children}
    </>
  );
};

export default AOSWrapper;
