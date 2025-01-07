import React from "react";
import Nav from "@/components/Header/Nav";

const Header: React.FC = () => {
  return (
    <div className="flex py-1 px-4 border-b-2 border-solid border-[#e8e7e6]">
      <Nav />
    </div>
  );
};

export default Header;
