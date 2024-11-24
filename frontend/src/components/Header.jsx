// src/components/Header.jsx

import './Header.css'; // Ensure this file exists

const Header = () => {
  return (
    <header className="app-header">
      <h1>Food Price/Portion Index</h1>
      <div className="header-description">
        <p>Track and compare food prices across different regions to make informed purchasing decisions.</p>
        <p>Features include price analysis, regional comparisons, and trend visualization.</p>
      </div>
    </header>
  );
};

export default Header;
