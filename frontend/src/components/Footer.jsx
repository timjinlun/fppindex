// src/components/Footer.jsx

import './Footer.css'; // Ensure this file exists

const Footer = () => {
  return (
    <footer className="app-footer">
      <p>&copy; {new Date().getFullYear()} Food Price/Portion Index. Presented by Jinlun Song.</p>
    </footer>
  );
};

export default Footer;
