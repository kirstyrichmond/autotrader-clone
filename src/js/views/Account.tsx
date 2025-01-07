import React from "react";
import { useAppDispatch } from "../../store/hooks";
import { logout } from "../../store/slices/authSlice";
import { useNavigate } from "react-router-dom";
import { persistor } from "../../store";
import MyAdverts from "@/components/MyAdverts";

export default function Account() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const handleSignOut = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      dispatch(logout());
      await persistor.purge();
      navigate('/');
    } catch (err) {
      console.error('Logout failed:', err);
    }
  };
  
  return (
    <div>
      <div className="max-w-[1272px] mx-auto">
        <div className="flex justify-end p-4">
          <button
            type="button"
            onClick={handleSignOut}
            className="px-6 py-2 text-white font-medium bg-blue-600 hover:bg-blue-700 rounded"
          >
            Sign out
          </button>
        </div>
        
        <MyAdverts />
      </div>
    </div>
  );
}