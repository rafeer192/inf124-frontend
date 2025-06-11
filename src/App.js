// import logo from './logo.svg';
import React, { useState } from 'react';
import './App.css';
import { Routes, Route, Navigate } from 'react-router-dom';
import UserContext from "./components/AccountContext";
import UserHome from './pages/UserHome'
import AboutUs from './pages/AboutUs'
import LoginPage from './pages/Login/LoginPage';
import RegisterPage from './pages/Login/RegisterPage';
import GoalPage from './pages/GoalPage';
import UserProfile from './pages/UserProfile';
import ContactUs from './pages/ContactUs';
import ContactUsLoggedIn from './pages/ContactUsLoggedIn'
import TermsAndConditions from './pages/TermsAndConditions';
import Crypto from './pages/Crypto';
import Stocks from './pages/Stocks';
import PrivateRoutes from "./components/PrivateRoutes";

function App() {
  const [customHoldings, setCustomHoldings] = useState([]);
  
  return (
    <UserContext>
      <Routes>
        {/* NO ACCOUNT NEEDED */}
        {/* ABOUT US PAGE == landing page */}
        <Route path='/' element={<AboutUs />} /> 
        {/* EXISTING USER LOG IN PAGE */}
        <Route path='/login' element={<LoginPage/>} />
        {/* REGISTER PAGE */}
        <Route path='/register' element={<RegisterPage/>} />
        {/* Terms And Conditions */}
        <Route path='/terms' element={<TermsAndConditions/>} />
        {/* Contact Us */}
        <Route path='/contact' element={<ContactUs/>} />

        {/* ACCOUNT NEEDED */}
        <Route element={<PrivateRoutes />}>
          {/* Goal PAGE */}
          <Route path='/goal' element={<GoalPage/>} />
          {/*User Profile */}
          <Route path='/profile' element={<UserProfile/>} />
          {/* Contact Us page for logged in users */}
          <Route path='/contactloggedin' element={<ContactUsLoggedIn/>} />
          {/* User's Home page */}
          <Route path='/userhome' element={<UserHome customHoldings={customHoldings} />} />
          {/* View Crypto */}
          <Route path='/crypto' element={<Crypto/>} />
          {/* View Stocks */}
          <Route path='/stocks' element={<Stocks customHoldings={customHoldings} setCustomHoldings={setCustomHoldings} />} />
        </Route>

        {/* REDIRECT TO LANDING PAGE FOR OTHER ENDPOINTS */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </UserContext>
  );
}

export default App;
