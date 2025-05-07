"use client";
import React, { ReactNode } from "react";
import Navbar from "./Navbar";
import { Provider } from "react-redux";
import store from "@/src/store/store";
import { SessionProvider } from "next-auth/react";

interface MainLayoutProps {
  children: ReactNode; // ReactNode is used to allow any valid React element (single or multiple)
  className?: string; // Optional className prop for styling
  header?: boolean; // Optional flag prop for custom logic
  bg?: string; // Optional bg prop for background styling
  links?: boolean; // Optional bg prop for background styling
}

const MainLayout: React.FC<MainLayoutProps> = ({
  children,
  className,
  header = true,
  bg,
  links = true,
}) => {
  // If you need to manipulate or clone the children, you can do it here
  const clonedChildren = React.Children.map(children, (child) =>
    React.isValidElement(child)
      ? React.cloneElement(child) // Passing additional props to children
      : child
  );

  return (
    <div className={`${className} min-h-screen`}>
      <div className={`pt-4 ${links && "bg-[#04c4ac]"}`}>
        {header && <Navbar links={links} />}
      </div>
      <Provider store={store}>
        <SessionProvider>{clonedChildren}</SessionProvider>
      </Provider>
    </div>
  );
};

export default MainLayout;
