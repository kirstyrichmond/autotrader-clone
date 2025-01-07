import React, { Fragment, useState, useEffect } from "react";
import { Dialog, DialogPanel, DialogTitle, Transition, TransitionChild } from "@headlessui/react";
import { IoMdClose as Close } from "react-icons/io";
import { useSelector } from "react-redux";
import { RootState } from "../../../store";
import Register from "./Register";
import Login from "./Login";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose }) => {
  const [isLogin, setIsLogin] = useState(true);
  const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);

  useEffect(() => {
    if (isAuthenticated) {
      onClose();
    }
  }, [isAuthenticated, onClose]);

  return (
    <Transition show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <TransitionChild
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-gray-500/75 transition-opacity" />
        </TransitionChild>

        <div className="fixed inset-0 overflow-hidden">
          <div className="absolute inset-0 overflow-hidden">
            <div className="fixed inset-y-0 right-0 flex max-w-full pl-10">
              <TransitionChild
                as={Fragment}
                enter="transform transition ease-in-out duration-500"
                enterFrom="translate-x-full"
                enterTo="translate-x-0"
                leave="transform transition ease-in-out duration-500"
                leaveFrom="translate-x-0"
                leaveTo="translate-x-full"
              >
                <DialogPanel className="w-screen max-w-md">
                  <div className="flex h-full flex-col overflow-y-scroll bg-white shadow-xl">
                    <div className="flex items-center justify-between px-4 py-6 sm:px-6">
                      <DialogTitle className="text-2xl font-semibold">{ isLogin ? 'Sign in' : 'Create account'}</DialogTitle>
                      <button type="button" className="rounded-md text-gray-400 hover:text-gray-500 focus:outline-none" onClick={onClose}>
                        <Close className="h-6 w-6" />
                      </button>
                    </div>

                    <div className="relative flex-1 px-4 sm:px-6">
                      <div className="space-y-6">
                        { isLogin ? (
                          <Login setIsLogIn={setIsLogin} />
                        ) : (
                          <Register setIsLogIn={setIsLogin} />
                        )}

                        <div className="flex items-center">
                          <input id="remember-me" name="remember-me" type="checkbox" className="h-4 w-4 rounded border-gray-300 text-blue-600" />
                          <label htmlFor="remember-me" className="ml-2 text-sm text-gray-600">
                            Remember me on this device
                          </label>
                        </div>

                        <p className="text-xs text-gray-500">
                          By continuing, you agree to the{" "}
                          <a href="#" className="text-blue-600 hover:underline">
                            Terms and Conditions
                          </a>{" "}
                          and confirm you have read our{" "}
                          <a href="#" className="text-blue-600 hover:underline">
                            Privacy Notice
                          </a>
                          .
                        </p>
                      </div>
                    </div>
                  </div>
                </DialogPanel>
              </TransitionChild>
            </div>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

export default AuthModal;