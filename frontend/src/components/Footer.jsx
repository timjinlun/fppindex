// src/components/Footer.jsx

import './Footer.css'; // Ensure this file exists

const Footer = () => {
  return (
    <footer className="app-footer">
      <div className="footer-content">
        <p className="copyright">
          &copy; {new Date().getFullYear()} Food Price/Portion Index
        </p>
        <div className="contact-info">
          <p>Created by: <span className="highlight">Jinlun Song</span></p>
          <p>Contact: <a href="mailto:timjinlun@gmail.com" className="email-link">timjinlun@gmail.com</a></p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
