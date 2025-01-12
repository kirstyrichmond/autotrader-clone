import React, { useState } from "react";
import { FaRegHeart as SavedIcon } from "react-icons/fa";
import { CgProfile as ProfileIcon } from "react-icons/cg";
import Logo from "../../../assets/images/logo.png";
import MenuNav from "./MenuNav";
import AuthModal from "../Auth/AuthModal";
import { useSelector } from "react-redux";
import { RootState } from "src/store";
import { useNavigate } from "react-router-dom";

const Nav: React.FC = () => {
    const navigate = useNavigate();
    const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
    const isLoggedIn = useSelector((state: RootState) => state.auth.isAuthenticated);

    const handleAccountClick = () => {
        if (isLoggedIn) {
            navigate('/secure/my-autotrader');
        } else {
            setIsAuthModalOpen(true);
        }
    }

    const handleSavedClick = () => {
        if (isLoggedIn) {
            navigate('/secure/saved-adverts');
        } else {
            setIsAuthModalOpen(true);
        }
    }

    return (
      <><div className="flex py-1 justify-between items-center w-full">
            <div onClick={() => navigate('/')} className="cursor-pointer">
                <img src={Logo} alt="AutoTrader Logo" className="h-6" />
            </div>
            <MenuNav />
            <div className="flex gap-6 items-center">
                <button onClick={handleSavedClick} className="text-gray-800 gap-1 flex flex-col items-center cursor-pointer bg-transparent">
                    <SavedIcon height={16} />
                    <p className="text-[12px]">Saved</p>
                </button>
                <button onClick={handleAccountClick} className="text-gray-800 gap-1 flex flex-col items-center cursor-pointer bg-transparent">
                    <ProfileIcon height={16} />
                    <p className="text-[12px]">Account</p>
                </button>
            </div>
        </div>
        <AuthModal
            isOpen={isAuthModalOpen}
            onClose={() => setIsAuthModalOpen(false)} />
    </>
    );
};

export default Nav;
