import React, { useState, useContext } from 'react';
import HeaderBar from '../components/HeaderBar';
import '../styles/PaymentUI.scss';
import { AccountContext } from '../components/AccountContext';

function PaymentUI() {
  // State Management
  const [orderType, setOrderType] = useState('market');
  const [orderAction, setOrderAction] = useState('buy');
  const stockOwned = 4; // Replace with user's currently own stock amount
  const [quantity, setQuantity] = useState(2);
  const [sliderValue, setSliderValue] = useState(stockOwned ? (quantity / stockOwned) * 100 : 0);
  const initialPrice = 911.13; // replace with current stock price
  const [orderPrice, setOrderPrice] = useState(initialPrice);

  // personal info from db
  const { user } = useContext(AccountContext);
  const fullName = `${user?.firstName} ${user?.lastName}`;
  
  const [orderDetails, setOrderDetails] = useState({
    cryptoBlock: {
      name: 'Crypto/Stock Name',
      value: `$${initialPrice.toFixed(2)}`,
    },
    paymentMethod: 'US Bank',
    quantity: quantity,
    fxRate: '$0.36',
    fxFee: '$0.18',
    orderValue: '$1822.26',
    commission: '$0.55'
  });

  // Event Handlers
  const handleOrderActionChange = (action) => {
    setOrderAction(action);
  };

  const handleOrderTypeChange = (type) => {
    setOrderType(type);
    updateOrderValue(quantity, orderPrice); 
  };

  const handleQuantityChange = (e) => {
    const newQuantity = Math.max(0, parseInt(e.target.value, 10) || 0);
    setQuantity(newQuantity);
    
    // Update slider when quantity changes
    if (stockOwned > 0 && orderAction === 'sell') {
      setSliderValue((newQuantity / stockOwned) * 100);
    }
    
    updateOrderValue(newQuantity, orderPrice);
  };

  const handleOrderPriceChange = (e) => {
    const newPrice = Math.max(0, parseFloat(e.target.value) || 0);
    setOrderPrice(newPrice);
    updateOrderValue(quantity, newPrice);
  };

  const handleSliderChange = (e) => {
    const percent = parseInt(e.target.value, 10);
    const calculatedQuantity = Math.round((percent / 100) * stockOwned);
    setSliderValue(percent);
    setQuantity(calculatedQuantity);
    updateOrderValue(calculatedQuantity, orderPrice);
  };

  // Helper Functions
  const updateOrderValue = (qty, price) => {
    let basePrice = orderType === 'market'
      ? initialPrice
      : price;

    const rawOrderValue = qty * basePrice;
    const commission = rawOrderValue * 0.0003;
    const fxRate = rawOrderValue * 0.0002;
    const fxFee = rawOrderValue * 0.0001;
    const totalWithCommission = rawOrderValue + commission + fxRate + fxFee;

    setOrderDetails({
      cryptoBlock: {
        name: 'Crypto/Stock Name',
        value: `$${initialPrice.toFixed(2)}`,
      },
      paymentMethod: 'US Bank',
      quantity: qty,
      orderValue: `$${totalWithCommission.toFixed(2)}`,
      commission: `$${commission.toFixed(2)}`,
      fxRate: `$${fxRate.toFixed(2)}`,
      fxFee: `$${fxFee.toFixed(2)}`
    });
  };

  return (
    <div>
      <HeaderBar userName={fullName} className="payment__header" /> 
      <div className="payment__container">
        <main className="payment">
          <div className="payment__card">
            {/* Crypto/Stock Info */}
            <div className="payment__crypto">
              <div className="payment__crypto-image">Crypto/Stock Image</div>
              <div className="payment__crypto-details">
                <div className="payment__crypto-name">{orderDetails.cryptoBlock.name}</div>
                <div className="payment__crypto-value">
                  <span>Value: </span><span>{orderDetails.cryptoBlock.value}</span>
                </div>
              </div>
            </div>

            {/* Order Details */}
            <div className="payment__order-details">
              <div className="payment__detail-item">
                <div className="payment__detail-label">Payment Method:</div>
                <div className="payment__detail-value">{orderDetails.paymentMethod}</div>
              </div>

              {/* Buy/Sell Buttons */}
              <div className="payment__detail-item">
                <div className="payment__detail-label">Action:</div>
                <div className="payment__order-action-selector">
                  <button 
                    className={`payment__order-action-btn ${orderAction === 'buy' ? 'active' : ''}`} 
                    onClick={() => handleOrderActionChange('buy')}
                  >
                    Buy
                  </button>
                  <button 
                    className={`payment__order-action-btn ${orderAction === 'sell' ? 'active' : ''}`} 
                    onClick={() => handleOrderActionChange('sell')}
                  >
                    Sell
                  </button>
                </div>
              </div>

              {/* Market/Limit Buttons */}
              <div className="payment__detail-item">
                <div className="payment__detail-label">Order Type:</div>
                <div className="payment__order-type-selector">
                  <button 
                    className={`payment__order-type-btn ${orderType === 'market' ? 'active' : ''}`} 
                    onClick={() => handleOrderTypeChange('market')}
                  >
                    Market
                  </button>
                  <button 
                    className={`payment__order-type-btn ${orderType === 'limit' ? 'active' : ''}`} 
                    onClick={() => handleOrderTypeChange('limit')}
                  >
                    Limit
                  </button>
                </div>
              </div>

              {/* Input sell limit price */}
              {orderType === 'limit' && (
                <div className="payment__detail-item">
                  <div className="payment__detail-label">Order Price:</div>
                  <div className="payment__price-input-wrapper">
                    <span className="payment__price-prefix">$</span>
                    <input 
                      type="number" 
                      min="0" 
                      step="0.01" 
                      value={orderPrice.toFixed(2)} 
                      onChange={handleOrderPriceChange} 
                      className="payment__price-input" 
                    />
                  </div>
                </div>
              )}

              {/* Show owned stock when selling */}
              {orderAction === 'sell' && (
                <div className="payment__detail-item">
                  <div className="payment__detail-label">Owned:</div>
                  <div className="payment__detail-value">{stockOwned}</div>
                </div>
              )}

              <div className="payment__detail-item">
                <div className="payment__detail-label">Quantity:</div>
                <div className="payment__detail-value">
                  {/* Buy/Sell Quantity */}
                  <input
                    type="number"
                    min="0"
                    max={orderAction === 'sell' ? stockOwned : undefined}
                    value={quantity}
                    onChange={handleQuantityChange}
                    className="payment__quantity-input"
                  />

                  {/* Slider For Selling */}
                  {orderAction === 'sell' && (
                    <div className="payment__slider-container">
                      <div className="payment__percentage">{Math.round(sliderValue)}%</div>
                      <input 
                        type="range" 
                        min="0" 
                        max="100" 
                        value={sliderValue} 
                        className="payment__slider" 
                        onChange={handleSliderChange} 
                      />
                    </div>
                  )}
                </div>
              </div>

              {/* COMMISION */}
              <div className="payment__detail-item">
                <div className="payment__detail-label">Commission (0.03%):</div>
                <div className="payment__detail-value">{orderDetails.commission}</div>
              </div>

              {/* EXCHANGE RATE */}
              <div className="payment__detail-item">
                <div className="payment__detail-label">FX Rate:</div>
                <div className="payment__detail-value">{orderDetails.fxRate}</div>
              </div>
              {/* EXCHANGE FEE */}
              <div className="payment__detail-item">
                <div className="payment__detail-label">FX Fee:</div>
                <div className="payment__detail-value">{orderDetails.fxFee}</div>
              </div>
            </div>
            
            <div className="payment__divider"></div>

            {/* TOTAL ORDER */}
            <div className="payment__total-section">
              <div className="payment__total-label">Order Value:</div>
              <div className="payment__total-value">{orderDetails.orderValue}</div>
            </div>

            <button className="payment__order-button">
              {orderAction === 'buy' ? 'Send Buy Order' : 'Send Sell Order'}
            </button>
          </div>
        </main>
      </div>
    </div>
  );
}

export default PaymentUI;