import React, { useState, useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import AuthModal from '@/components/Auth/AuthModal';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const location = useLocation();
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);

  useEffect(() => {
    if (!isAuthenticated) {
      setIsAuthModalOpen(true);
    }
  }, [isAuthenticated]);

  // When auth modal is closed and user is still not authenticated, redirect to home
  const handleAuthModalClose = () => {
    setIsAuthModalOpen(false);
    if (!isAuthenticated) {
      window.location.href = '/';
    }
  };

  if (!isAuthenticated) {
    return (
      <>
        <AuthModal 
          isOpen={isAuthModalOpen} 
          onClose={handleAuthModalClose}
        />
        <Navigate to="/" state={{ from: location }} replace />
      </>
    );
  }

  return <>{children}</>;
};

export default ProtectedRoute;