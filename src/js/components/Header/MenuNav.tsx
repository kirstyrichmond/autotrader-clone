import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "../../../store";
import { openAuthModal } from "../../../store/slices/authSlice";

const MenuNav: React.FC = () => {
    const dispatch = useDispatch<AppDispatch>();
    const navigate = useNavigate();
    const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);

    const menuItems = [
        { name: "Used cars", path: "/search?radius=NATIONAL&page=1&perPage=1000" },
        // { name: "New cars", path: "/search?radius=NATIONAL&page=1&perPage=1000" },
        { name: "Sell your car", path: "/selling/find-car", requiresAuth: true },
        // { name: "Value your car", path: "/" },
        // { name: "Car reviews", path: "/" },
        // { name: "Car leasing", path: "/" },
        // { name: "Electric cars", path: "/" },
        // { name: "Buy a car online", path: "/" },
    ];

    const handleItemClick = (e: React.MouseEvent<HTMLAnchorElement>, item: typeof menuItems[0]) => {
        e.preventDefault();
        
        if (item.requiresAuth && !isAuthenticated) {
            dispatch(openAuthModal());
        } else {
            navigate(item.path);
        }
    };

    return (
        <div className="flex items-center h-auto">
            <ul className="flex gap-3">
                {menuItems.map((item, index) => (
                    <li key={index}>
                        <a
                            href={item.path}
                            onClick={(e) => handleItemClick(e, item)}
                            className="text-[#242d3d] hover:text-blue-600 transition-colors"
                        >
                            {item.name}
                        </a>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default MenuNav;