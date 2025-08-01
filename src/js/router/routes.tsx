import React from "react";
import { RouteObject } from "react-router-dom";
import { RoutePaths } from './types';
import ProtectedRoute from './ProtectedRoute';
import LandingPage from "@/views/LandingPage";
import CarSearch from "@/views/CarSearch";
import Account from "@/views/Account";
import FindCar from "@/views/FindCar";
import Selling from "@/views/Selling";
import Advert from "@/views/Advert";
import CarDetails from "@/views/CarDetails";
import Saved from "@/views/Saved";
import Chat from "@/views/Chat";
import SearchResults from "@/views/SearchResults";

const Routes: RouteObject[] = [
    {
        path: RoutePaths.LandingPage,
        element: <LandingPage />,
    },
    {
        path: RoutePaths.Search,
        element: <SearchResults />,
    },
    {
        path: RoutePaths.Account,
        element: <Account />,
    },
    {
        path: RoutePaths.Saved,
        element: <Saved />,
    },
    {
        path: RoutePaths.Selling,
        element: (
            <ProtectedRoute>
                <Selling />
            </ProtectedRoute>
        ),
        children: [
            { 
                path: RoutePaths.FindCar, 
                element: (
                    <ProtectedRoute>
                        <FindCar/>
                    </ProtectedRoute>
                ) 
            },
            { 
                path: RoutePaths.Advert, 
                element: (
                    <ProtectedRoute>
                        <Advert/>
                    </ProtectedRoute>
                ) 
            },
            { 
                path: RoutePaths.Edit, 
                element: (
                    <ProtectedRoute>
                        <Advert/>
                    </ProtectedRoute>
                ) 
            },
        ]
    },
    {
        path: RoutePaths.Details,
        element: <CarDetails />,
    },
    {
        path: RoutePaths.Chats,
        element: (
            <ProtectedRoute>
                <Chat />
            </ProtectedRoute>
        )
      },
      {
        path: RoutePaths.Chat,
        element: (
            <ProtectedRoute>
                <Chat />
            </ProtectedRoute>
        )
      }
];

export default Routes;