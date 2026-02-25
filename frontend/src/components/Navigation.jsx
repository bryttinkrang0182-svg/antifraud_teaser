import { useState } from 'react';
import { Link } from 'react-router-dom';
import './Navigation.css';

const Navigation = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const closeMenu = () => {
    setMenuOpen(false);
  };

  return (
    <nav className="top-nav" aria-label="Main navigation">
      <button 
        className={`hamburger ${menuOpen ? 'active' : ''}`} 
        aria-label="Toggle menu" 
        onClick={toggleMenu}
      >
        <span></span>
        <span></span>
        <span></span>
      </button>
      <ul className={`nav-links ${menuOpen ? 'active' : ''}`}>
        <li><Link to="/" onClick={closeMenu}>Home</Link></li>
        <li><Link to="/victim-count" onClick={closeMenu}>About</Link></li>
        <li><a href="#" onClick={closeMenu}>Safety</a></li>
        <li><a href="#" onClick={closeMenu}>Report</a></li>
      </ul>
    </nav>
  );
};

export default Navigation;
