import React from "react";
import { Outlet } from "react-router-dom";


export default function Selling() {
return (
    <div className="max-w-[1272px] flex flex-col my-16 mx-32 gap-4">
      <Outlet />
    </div>
);
}
