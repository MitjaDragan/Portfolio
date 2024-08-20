import React from 'react';
import './Navbar.css';

function Navbar() {
    return (
        <nav className="navbar">
            <div className="navbar-brand">Mitja Dragan</div>
            <ul className="navbar-links">
                <li><a href="#about">About</a></li>
                <li><a href="#projects">Projects</a></li>
                <li><a href="#contact">Contact</a></li>
            </ul>
            <div className="navbar-button">
                <a href="#contact">Hire Me</a>
            </div>
        </nav>
    );
}

export default Navbar;
