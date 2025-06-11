import React, { useState, useContext } from 'react';
import HeaderBar from '../components/HeaderBar';
import TipTile from '../components/TipTile';
import NewsTile from '../components/NewsTile';
import PortfolioChart from '../components/PortfolioChart';
import BudgetChart from '../components/BudgetChart';
import '../styles/UserHome.css';
import { AccountContext } from '../components/AccountContext';
import HoldingTile from './HoldingTile';

export default function UserHome({ customHoldings }) {
  // personal info from db
  const { user } = useContext(AccountContext)
  const fullName = `${user?.firstName} ${user?.lastName}`;
  
  return (
    <div className="user-home-container">
      {/* for now, must change when backend is made  */}
      <HeaderBar userName={fullName} /> 
      <div className="main-content">
        <div className="left-column">
          <TipTile />
          <NewsTile />
          <HoldingTile customHoldings={customHoldings} />
        </div>
        <div className="right-column">
          <div className="chart-wrapper">
            <PortfolioChart />
          </div>
          <div className="chart-wrapper">
            <BudgetChart />
          </div>
        </div>
      </div>
    </div>
  );
}