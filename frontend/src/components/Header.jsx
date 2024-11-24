// src/components/Header.jsx

import './Header.css'; // Ensure this file exists

const Header = () => {
  return (
    <header className="app-header">
      <h1>Food Price/Portion Index</h1>
      <div className="header-description">
        <p className="main-description">
          A citizen science project exploring how food portions and prices vary across different cultures and regions worldwide, helping us understand global food consumption patterns.
        </p>
        <div className="description-details">
          <div className="description-item">
            <h3>🌍️ Cultural Insights</h3>
            <p>Discover how portion sizes differ across cultures and how they reflect local eating habits and traditions.</p>
          </div>
          <div className="description-item">
            <h3>🌏 Regional Variations</h3>
            <p>Compare how the same food items are portioned and priced differently in various parts of the world.</p>
          </div>
          <div className="description-item">
            <h3>🤝 Community Research</h3>
            <p>Join a global community documenting real-world food portions and prices to better understand cultural food practices.</p>
          </div>
        </div>
        <p className="mission-statement">
          Understanding portion sizes across cultures can help us learn about different dietary habits, 
          food accessibility, and cultural approaches to nutrition worldwide.
        </p>
      </div>
    </header>
  );
};

export default Header;
