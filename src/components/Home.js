import React from 'react';
import './Home.css';
import mitjadragan from '../assets/images/mitjadragan.jpg';

function Home() {
  return (
    <div className="home-container">
      {/* Left Side: Image and Text */}
      <div className="home-left">
        <img src={mitjadragan} alt="Mitja Dragan's Profile" className="profile-picture" />
        <div className="bio-content">
          <h2>Mitja Dragan</h2>
          <p>
            Full Stack Developer with a strong frontend focus, I prioritize family, loyalty, honesty, and self-improvement 
            in both my professional and personal life. I’m passionate about building robust, trustworthy software systems 
            and committed to learning and growth.
          </p>
          <ul className="skills-list">
            <li>JavaScript</li>
            <li>Python</li>
            <li>HTML & CSS</li>
            <li>Angular JS</li>
            <li>PostgreSQL</li>
          </ul>
        </div>
      </div>

      {/* Right Side: Contact Form */}
      <div className="contact-form-right">
        <h3>Let's Connect</h3>
        <form className="contact-form">
          <input type="text" placeholder="Your Name" required />
          <input type="email" placeholder="Your Email" required />
          <textarea placeholder="Your Message" required></textarea>
          <button type="submit">Hire Me</button>
        </form>
      </div>
    </div>
  );
}

export default Home;
