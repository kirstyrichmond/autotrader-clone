import React from "react";
import { Outlet } from "react-router-dom";


export default function Selling() {
return (
    <div className="flex flex-col my-8 mx-4 sm:my-16 sm:mx-8 lg:mx-32 gap-4">
      <Outlet />
    </div>
);
}
