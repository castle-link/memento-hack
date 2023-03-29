import React, { ReactNode } from "react";
import dynamic from "next/dynamic";

const ComponentWrapper = ({ children }: { children: ReactNode }) => {
  return <>{children}</>;
};

export const DisableSSR = dynamic(() => Promise.resolve(ComponentWrapper), {
  ssr: false,
});
