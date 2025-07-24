import React, { useEffect, useState } from "react";
import { FaRegHeart as SavedIcon } from "react-icons/fa";
import { CgProfile as ProfileIcon } from "react-icons/cg";
import { HiOutlineMenu } from "react-icons/hi";
import Logo from "../../../assets/images/logo.png";
import MenuNav from "./MenuNav";
import AuthModal from "../Auth/AuthModal";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "src/store";
import { useNavigate } from "react-router-dom";
import { Mail } from 'lucide-react';
import { fetchUnreadCount } from "../../../store/slices/chatSlice";

const Nav: React.FC = () => {
    const dispatch = useDispatch<AppDispatch>();
    const userId = useSelector((state: RootState) => state.auth.user?.id);
    const unreadCount = useSelector((state: RootState) => state.chat.unreadCount);
    const navigate = useNavigate();
    const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const isLoggedIn = useSelector((state: RootState) => state.auth.isAuthenticated);

    const handleAccountClick = () => {
        if (isLoggedIn) {
            navigate('/secure/my-autotrader');
        } else {
            setIsAuthModalOpen(true);
        }
        setIsMobileMenuOpen(false);
    }

    const handleSavedClick = () => {
        if (isLoggedIn) {
            navigate('/secure/saved-adverts');
        } else {
            setIsAuthModalOpen(true);
        }
        setIsMobileMenuOpen(false);
    }

    const handleMessagesClick = () => {
        if (isLoggedIn) {
            navigate('/chats');
        } else {
            setIsAuthModalOpen(true);
        }
        setIsMobileMenuOpen(false);
    }

    const toggleMobileMenu = () => {
        setIsMobileMenuOpen(!isMobileMenuOpen);
    }

    const closeMobileMenu = () => {
        setIsMobileMenuOpen(false);
    }

    const menuItems = [
        { name: "Used cars", path: "/" },
        { name: "New cars", path: "/" },
        { name: "Sell your car", path: "/selling/find-car", requiresAuth: true },
    ];

    const handleMenuItemClick = (item: typeof menuItems[0]) => {
        if (item.requiresAuth && !isLoggedIn) {
            setIsAuthModalOpen(true);
        } else {
            navigate(item.path);
        }
        closeMobileMenu();
    }

    useEffect(() => {
        if (userId) {
          const fetchCount = () => {
            dispatch(fetchUnreadCount(userId));
          };
          
          fetchCount();
          const interval = setInterval(fetchCount, 30000);
          return () => clearInterval(interval);
        }
    }, [unreadCount, userId]);

    return (
        <>
            <div className="flex py-1 justify-between items-center w-full relative">
                <div onClick={() => navigate('/')} className="cursor-pointer">
                    <img src={Logo} alt="AutoTrader Logo" className="h-6" />
                </div>
                <div className="hidden lg:block">
                    <MenuNav />
                </div>
                <div className="hidden md:flex gap-6 items-center">
                    <button onClick={handleSavedClick} className="text-gray-800 gap-1 flex flex-col items-center cursor-pointer bg-transparent">
                        <SavedIcon height={16} />
                        <p className="text-[12px]">Saved</p>
                    </button>
                    <button onClick={handleMessagesClick} className="relative text-gray-800 gap-1 flex flex-col items-center cursor-pointer bg-transparent">
                        <Mail height={16} />
                        {unreadCount > 0 && (
                            <div className="absolute top-0 right-6 bg-red-500 text-white rounded-full w-4 h-4 flex items-center justify-center text-[10px]">
                                {unreadCount}
                            </div>
                        )}
                        <p className="text-[12px]">Messages</p>
                    </button>
                    <button onClick={handleAccountClick} className="text-gray-800 gap-1 flex flex-col items-center cursor-pointer bg-transparent">
                        <ProfileIcon height={16} />
                        <p className="text-[12px]">Account</p>
                    </button>
                </div>
                <button 
                    onClick={toggleMobileMenu}
                    className="md:hidden text-gray-800 p-2 hover:bg-gray-100 rounded-md transition-colors"
                    aria-label="Toggle menu"
                >
                    <HiOutlineMenu size={24} />
                </button>
                {isMobileMenuOpen && (
                    <>
                        <div 
                            className="fixed inset-0 z-40 bg-black bg-opacity-25 md:hidden"
                            onClick={closeMobileMenu}
                        />
                        <div className="absolute top-full right-0 z-50 w-64 bg-white border border-gray-200 rounded-lg shadow-lg md:hidden">
                            <div className="py-2">
                                <div className="px-4 py-2 border-b border-gray-100">
                                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Menu</p>
                                </div>
                                {menuItems.map((item, index) => (
                                    <button
                                        key={index}
                                        onClick={() => handleMenuItemClick(item)}
                                        className="w-full text-left px-4 py-3 text-gray-800 hover:bg-gray-50 transition-colors"
                                    >
                                        {item.name}
                                    </button>
                                ))}
                                <div className="px-4 py-2 border-t border-gray-100">
                                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Account</p>
                                </div>
                                <button 
                                    onClick={handleSavedClick} 
                                    className="w-full text-left px-4 py-3 text-gray-800 hover:bg-gray-50 transition-colors flex items-center gap-3"
                                >
                                    <SavedIcon height={16} />
                                    <span>Saved</span>
                                </button>
                                <button 
                                    onClick={handleMessagesClick} 
                                    className="w-full text-left px-4 py-3 text-gray-800 hover:bg-gray-50 transition-colors flex items-center gap-3"
                                >
                                    <Mail height={16} />
                                    <span>Messages</span>
                                    {unreadCount > 0 && (
                                        <div className="ml-auto bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
                                            {unreadCount}
                                        </div>
                                    )}
                                </button>
                                <button 
                                    onClick={handleAccountClick} 
                                    className="w-full text-left px-4 py-3 text-gray-800 hover:bg-gray-50 transition-colors flex items-center gap-3"
                                >
                                    <ProfileIcon height={16} />
                                    <span>Account</span>
                                </button>
                            </div>
                        </div>
                    </>
                )}
            </div>
            <AuthModal
                isOpen={isAuthModalOpen}
                onClose={() => setIsAuthModalOpen(false)} 
            />
        </>
    );
};

export default Nav;
