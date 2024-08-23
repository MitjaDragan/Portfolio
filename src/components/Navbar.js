import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css';

import LogoLightTheme from '../assets/images/LogoLightTheme.png';
import LogoDarkTheme from '../assets/images/LogoDarkTheme.png';
import SunIcon from '../assets/images/Sun.png';
import MoonIcon from '../assets/images/Moon.png';


function Navbar() {
    const [theme, setTheme] = useState('dark');
    const [transitioning, setTransitioning] = useState(false);

    const toggleTheme = () => {
      setTransitioning(true);

      setTimeout(() => {
          setTheme(prevTheme => prevTheme === 'dark' ? 'light' : 'dark');
          setTransitioning(false);
      }, 150);  // Match this duration with the CSS transition duration
    };
    
    useEffect(() => {
      document.body.className = theme + '-theme';
    }, [theme]);

    return (
        <nav className={`navbar navbar-expand-lg fixed-top ${theme === 'dark' ? 'navbar-dark bg-dark' : 'bg-light navbar-light'}`}>
            <div className="container">
              <Link to="/">
                <a className="navbar-brand"
                  ><img
                    src={theme === 'light' ? LogoLightTheme : LogoDarkTheme}
                    alt="Logo"
                    draggable="false"
                    height="60"
                /></a>
              </Link>
                <div className="collapse navbar-collapse" id="navbarSupportedContent">
                  <ul className="navbar-nav ms-auto align-items-center">
                    <li className="nav-item">
                      <a className="nav-link mx-2" to="/"><i className="fas fa-plus-circle pe-2"></i>About me</a>
                    </li>
                    <li className="nav-item">
                      <Link to="/projects">
                        <a className="nav-link mx-2" href="#!"><i className="fas fa-bell pe-2"></i>Projects</a>
                      </Link>
                    </li>
                    <li className="nav-item">
                      <a className="nav-link mx-2" href="#!"><i className="fas fa-heart pe-2"></i>Certificates</a>
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
