import React, { useState, useEffect } from 'react';
import Modal from './Modal';
import { Link } from 'react-router-dom';
import './Navbar.css';

import LogoLightTheme from '../assets/images/LogoLightTheme.png';
import LogoDarkTheme from '../assets/images/LogoDarkTheme.png';
import LogoLightThemeSmall from '../assets/images/LogoLightThemeSmall.png';
import LogoDarkThemeSmall from '../assets/images/LogoDarkThemeSmall.png';
import SunIcon from '../assets/images/Sun.png';
import MoonIcon from '../assets/images/Moon.png';

function Navbar() {
  const [theme, setTheme] = useState('light');
  const [transitioning, setTransitioning] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(true);
  const [navbarHeight, setNavbarHeight] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);

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

  const handleLinkClick = () => {
    setIsCollapsed(true);
  };

  useEffect(() => {
    const navbar = document.querySelector('.navbar');
    if (navbar) {
      setNavbarHeight(navbar.offsetHeight);
    }

    const handleResize = () => {
      setNavbarHeight(navbar.offsetHeight);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [theme, isCollapsed]);

  useEffect(() => {
    document.body.className = theme + '-theme';
  }, [theme]);

  return (
    <>
      <nav className={`navbar navbar-expand-lg fixed-top ${theme === 'dark' ? 'navbar-dark bg-dark' : 'bg-light navbar-light'}`}>
        <div className="container">
          <Link to="/" className="navbar-brand">
            <img
              src={theme === 'light'
                ? (window.innerWidth <= 420 ? LogoLightThemeSmall : LogoLightTheme)
                : (window.innerWidth <= 420 ? LogoDarkThemeSmall : LogoDarkTheme)}
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
                <Link to="/" className="nav-link mx-2" onClick={handleLinkClick}>About me</Link>
              </li>
              <li className="nav-item">
                <Link to="/projects" className="nav-link mx-2" onClick={handleLinkClick}>Projects</Link>
              </li>
              <li className="nav-item">
                <Link to="/certificates" className="nav-link mx-2" onClick={handleLinkClick}>Certificates</Link>
              </li>
              <li className="nav-item">
                <Link to="/work-diary" className="nav-link mx-2" onClick={handleLinkClick}>Work Diary</Link>
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
                <button className={`btn btn-rounded ${theme === 'dark' ? 'btn-dark-theme' : 'btn-light-theme'}`} onClick={() => setIsModalOpen(true)}>Hire Me</button>
              </li>
            </ul>
          </div>
        </div>
      </nav>
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
      <div id="main-content" style={{ paddingTop: `${navbarHeight + 20}px` }}>
        {/* Page content */}
      </div>
    </>
  );
}

export default Navbar;
