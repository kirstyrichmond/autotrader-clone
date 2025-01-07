# Autotrader Clone

Created by Kirsty Richmond.

## Video Demo:


## Description: 

\*\* **Built for learning purposes only** \*\*

This project is a clone of the UK's largest digital marketplace for buying and selling new and used cars.

Currently in the project you can:
- Create an account using email and password
- Sign in or out of your account with email and password
- Search for vehicles within a set radius
- View the vehicle details and images
- Create a vehicle listing: including uploading images and retrieving basic vehicle information for registration provided
- View all vehicle listings on your account page
- Edit/delete vehicle listings


Future implementations:
- Filter vehicle search (colour, min-year, max-year, transmission, engine size, price etc.)
- Project filter for vehicle type (cars, vans, bikes, motorhomes, trucks etc.)
- Create loading spinner for initial page load
- Auto scroll to first error in form
- Save vehicle
- Contact seller (message, phone number etc.)
- Vehicle valuation
- Track vehicle listing views


Design choices:
- When deciding how it would be best to link the user's vehicle listing to their account, I decided to add the user's id to the vehicle listing and that way I could fetch vehicles that had the logged in user's id when displaying the user's listings on the account page. I decided to add the user_id to the vehicles table and create a foreign key relationship because the foreign key ensures that every vehicle belongs to a valid user and you can easily find all vehicles belonging to a user with a simple query.


## File info: 

/backend/seed_data.py
This file contains a function that seeds the database with sample data. The script uses Flask, SQLAlchemy and werkzeug to create and populate the database tables.

/backend/run.py
This file is the entry point for running the Flask application. A Flask instance is created and configured.

/backend/app/models.py
This file contains SQLAlchemy models for Vehicle and User and a SQLAlchemy type decorator for handling JSON-encoded dictionaries which is used to store a dictionary of images as a JSON string.

/backend/app/routes.py
This file defines a set of API routes using Flask. There are routes for handling user authentication and vehicle related data.

/backend/app/utils.py
This file contains a get_postcode_coordinates function which takes the users postcode, uses the postcodes.io API to then retrieve the latitude, longitude and location data. 
The calculate_distance function uses the coordinates retrieved from the get_postcode_coordinates function to calculate the distance between the vehicles location and the users location.

/src/store/slices/advertSlice.ts
This file defines a Redux slice for managing the state of the current advertisement being created.

/src/store/slices/authSlice.ts
This file defines a Redux slice for managing the state of the user.

/src/store/slices/listingsSlice.ts
This file defines a Redux slice for managing the state of the vehicle advertisements.

/src/services/api.ts
This file contains a function that is called in the VehicleSearchForm component which allows the user to enter a post code and a radius. This function takes those values as a parameter and fetches any vehicles that are within the chosen radius from the given post code.

/src/js/components/Auth/AuthModal.tsx
This component uses the Headless UI library to create a modal that allows the user to create an account or sign in.

/src/js/components/Auth/Login.tsx
This Login component uses Redux to login.

/src/js/components/Auth/Login.tsx
This Register component uses Redux to register.

/src/js/components/Header/MenuNav.tsx
The MenuNav component contains menu items.

/src/js/components/Header/Nav.tsx
The Nav component contains the logo, favourites and account icon.

/src/js/components/ui/card.tsx
This file uses the shadcn library to create the card component.

/src/js/components/FilterBox.tsx
This is a component that will be used to filter the fetched vehicles when a user is looking to buy. This has not been implemented yet.

/src/js/components/GalleryModal.tsx
The GalleryModal component is used in the CarDetails component to display the vehicle listing images

/src/js/components/MyAdverts.tsx
MyAdverts fetches all the vehicle listings the logged in user has and displays them. There is also edit and delete functionality for each vehicle listing.

/src/js/components/ResultItem.tsx
This component is used on the results page. It displays basic information and an image of the vehicle listing. Clicking on the listing navigates the user to the car listing's page.

/src/js/components/Results.tsx
The results component maps through the vehicles returned from the vehicle search and displays them here.

/src/js/components/VehicleSearchForm.tsx
The VehicleSearchForm allows the user to input a post code and select a radius. When the user submits this form the searchVehicles function is called and fetches the vehicles within the distance of the postcode the user entered.

/src/js/layout/Header.tsx
The Header component renders the Nav component

/src/js/lib/utils.ts
The utils.ts file contains the cn function which is required for the shancn library. It is a utility function that combines and merges tailwinds class names as a single string.

/src/js/router/ProtectedRoute.tsx
The ProtectedRoute component is used in the /router/routes.tsx file. If a component is wrapped in the ProtectedRoute component and a user tries to access it without being logged in, they will be redirected to the landing page.

/src/js/router/routes.tsx
The Routes component contains the paths, elements and children paths for the project. The RoutePath endpoints are kept in a separate file for separation of concerns and to keep the project structure clean. Routes that a user has to be logged in for are wrapped in the ProtectedRoute component.

/src/js/router/types.tsx
This file contains the RoutePaths object which contains the endpoints for the project.

/src/js/views/Account.tsx
The accounts component contains the sign out button and the MyAdverts component.

/src/js/views/Advert.tsx
The ImageGrid component allows the user to add images from their device, set a main photo and reorder the images. The Advert component contains the form for the user to input the data for the vehicle they are selling. 

/src/js/views/CarDetails.tsx
The CarDetails component displays all the information on the vehicle. The GalleryModal is used in this component so the user can view all vehicle images.

/src/js/views/CarSearch.tsx
This component is not yet being used. But in the future, this is the page the user will be directed to from the landing page once they search for a vehicle.

/src/js/views/FindCar.tsx
This component contains 2 views. First, when arriving on the selling page, the user must enter their registration plate and mileage. Once that is submitted, a table displaying their basic vehicle data will be shown and they can either confirm it is their vehicle or go back and try again.

/src/js/views/LandingPage.tsx
The LandingPage contains the vehicle search form and once a user has searched for vehicles, the vehicle listings show below.

/src/js/views/Selling.tsx
The selling route has a few children routes, so this component uses Outlet to render the child route element, dependent on the current route.

/src/js/App.tsx
This file sets up the root of the project and integrates several key libraries and configurations such as react-router-dom, react-redux and redux-persist.

/src/js/Main.tsx
In the Main component, useRoutes(routes) is used to return an element that corresponds to the current route. This allows the project to render different components based on the URL path. The component includes the Header component as this is shown on every page.

/src/js/schemas/index.tsx
This file contains the schema objects for the validation of the advert listing and find car form. Formik and Yup is used for the validation.

#### Created with:

[![React](https://img.shields.io/badge/React-%2320232a.svg?logo=react&logoColor=%2361DAFB)](#)
[![React Router](https://img.shields.io/badge/React_Router-CA4245?logo=react-router&logoColor=white)](#)
[![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?logo=typescript&logoColor=fff)](#)
[![Redux](https://img.shields.io/badge/Redux-764ABC?logo=redux&logoColor=fff)](#)
[![shadcn/ui](https://img.shields.io/badge/shadcn%2Fui-000?logo=shadcnui&logoColor=fff)](#)
[![TailwindCSS](https://img.shields.io/badge/Tailwind%20CSS-%2338B2AC.svg?logo=tailwind-css&logoColor=white)](#)
[![Python](https://img.shields.io/badge/Python-3776AB?logo=python&logoColor=fff)](#)
[![Flask](https://img.shields.io/badge/Flask-000?logo=flask&logoColor=fff)](#)
[![SQLite](https://img.shields.io/badge/SQLite-%2307405e.svg?logo=sqlite&logoColor=white)](#)
[![Vite](https://img.shields.io/badge/Vite-646CFF?logo=vite&logoColor=fff)](#)