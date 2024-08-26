import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css';

import LogoLightTheme from '../assets/images/LogoLightTheme.png';
import LogoDarkTheme from '../assets/images/LogoDarkTheme.png';
import LogoLightThemeSmall from '../assets/images/LogoLightThemeSmall.png';
import LogoDarkThemeSmall from '../assets/images/LogoDarkThemeSmall.png';
import SunIcon from '../assets/images/Sun.png';
import MoonIcon from '../assets/images/Moon.png';

function Navbar() {
  const [theme, setTheme] = useState('dark');
  const [transitioning, setTransitioning] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(true);
  const [isSmallScreen, setIsSmallScreen] = useState(window.innerWidth <= 420);

  const toggleTheme = () => {
    setTransitioning(true);
    setTimeout(() => {
      setTheme((prevTheme) => (prevTheme === 'dark' ? 'light' : 'dark'));
      setTransitioning(false);
    }, 150);
  };

  const handleToggle = () => {
    setIsCollapsed(!isCollapsed);
  };

  useEffect(() => {
    document.body.className = theme + '-theme';

    const handleResize = () => {
      setIsSmallScreen(window.innerWidth <= 420);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [theme]);

  return (
    <nav className={`navbar navbar-expand-lg fixed-top ${theme === 'dark' ? 'navbar-dark bg-dark' : 'bg-light navbar-light'}`}>
      <div className="container">
        <Link to="/" className="navbar-brand">
          <img
            src={theme === 'light'
              ? (isSmallScreen ? LogoLightThemeSmall : LogoLightTheme)
              : (isSmallScreen ? LogoDarkThemeSmall : LogoDarkTheme)}
            alt="Logo"
            draggable="false"
            height="60"
          />
        </Link>
        <button
          className="navbar-toggler"
          type="button"
          onClick={handleToggle}
          aria-controls="navbarSupportedContent"
          aria-expanded={!isCollapsed}
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className={`collapse navbar-collapse ${isCollapsed ? '' : 'show'}`} id="navbarSupportedContent">
          <ul className="navbar-nav ms-auto">
            <li className="nav-item">
              <Link to="/" className="nav-link mx-2"><i className="fas fa-plus-circle pe-2"></i>About me</Link>
            </li>
            <li className="nav-item">
              <Link to="/projects" className="nav-link mx-2"><i className="fas fa-bell pe-2"></i>Projects</Link>
            </li>
            <li className="nav-item">
              <Link to="/certificates" className="nav-link mx-2"><i className="fas fa-heart pe-2"></i>Certificates</Link>
            </li>
            <li className="nav-item ms-3">
              <button onClick={toggleTheme} className="theme-toggle-btn">
                <img
                  src={theme === 'dark' ? SunIcon : MoonIcon}
                  alt="Toggle Button"
                  height="30"
                  className={transitioning ? 'fade-out' : 'fade-in'}
                />
              </button>
            </li>
            <li className="nav-item ms-3">
              <button className={`btn btn-rounded ${theme === 'dark' ? 'btn-dark-theme' : 'btn-light-theme'}`}>
                Hire me
              </button>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
