import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "../../../store";
import AuthModal from "../Auth/AuthModal";

const MenuNav: React.FC = () => {
    const navigate = useNavigate();
    const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
    const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);

    const menuItems = [
        { name: "Used cars", path: "/" },
        { name: "New cars", path: "/" },
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
            setIsAuthModalOpen(true);
        } else {
            navigate(item.path);
        }
    };

    return (
        <>
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
            <AuthModal
                isOpen={isAuthModalOpen}
                onClose={() => setIsAuthModalOpen(false)}
            />
        </>
    );
};

export default MenuNav;