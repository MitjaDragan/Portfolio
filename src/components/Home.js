import React, { useState } from 'react';
import emailjs from 'emailjs-com';
import './Home.css';
import { Link } from 'react-router-dom';
import mitjadragan from '../assets/images/mitjadragan.jpg';
import testimage from '../assets/images/AvatarMaker.png'

function Home() {
  const [statusMessage, setStatusMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false); // New loading state

  const sendEmail = (e) => {
    e.preventDefault();
    setIsLoading(true); // Set loading to true when form is submitted

    emailjs.sendForm('service_csi7mwl', 'template_304ts7w', e.target, 'fS5fCp6NoEpBQG9pS')
      .then((result) => {
        setStatusMessage("Message sent successfully!");
        setIsLoading(false); // Stop loading once email is sent
        e.target.reset();
      }, (error) => {
        setStatusMessage("Failed to send message. Please try again.");
        setIsLoading(false); // Stop loading if there's an error
      });
  };

  return (
    <div>
      {/* First Section: Home Content */}
      <div className="home-container">
        {/* Left Side: Image and Text */}
        <div className="home-left">
          <img src={testimage} alt="Mitja Dragan's Profile" className="profile-picture" />
          <div className="bio-content">
            <h2>Mitja Dragan</h2>
            <p>
              Full Stack Developer with a strong frontend focus, I prioritize family, loyalty, honesty, and self-improvement 
              in both my professional and personal life. I’m passionate about building robust, trustworthy software systems 
              and committed to learning and growth.
            </p>
            <ul className="skills-list">
              <li>React</li>
              <li>JavaScript</li>
              <li>Python</li>
              <li>HTML & CSS</li>
              <li>Angular JS</li>
              <li>PostgreSQL</li>
              <li>Odoo</li>
            </ul>
          </div>
        </div>

        {/* Right Side: Contact Form */}
        <div className="contact-form-right">
          <h3>Let's Connect</h3>
          <form onSubmit={sendEmail} className="contact-form">
            <input type="text" name="name" placeholder="Your Name" required />
            <input type="email" name="email" placeholder="Your Email" required />
            <textarea name="message" placeholder="Your Message" required></textarea>
            <button type="submit" disabled={isLoading}>
              {isLoading ? (
                <div className="spinner"></div> // Placeholder for a loading spinner
              ) : (
                "Hire Me"
              )}
            </button>
          </form>
          <p>{statusMessage}</p>
        </div>
      </div>

      {/* Second Section: Projects */}
      <div className="projects-section">

        {/* Project 1: Sudoku */}
        <div className="project-card left-aligned">
          <h3>Sudoku</h3>
          <p>An interactive Sudoku game built to challenge users with varying levels of difficulty.</p>
          <div className="project-tags">
            <span>JavaScript</span>
            <span>React</span>
            <span>CSS</span>
          </div>
          <Link to="/sudoku" className="view-project">View Project</Link>
        </div>

        {/* Project 2: Jigsaw Puzzle */}
        <div className="project-card right-aligned">
          <h3>Jigsaw Puzzle</h3>
          <p>A classic Jigsaw puzzle game that offers fun and improves spatial reasoning skills.</p>
          <div className="project-tags">
            <span>JavaScript</span>
            <span>HTML5</span>
            <span>CSS</span>
          </div>
          <Link to="/jigsaw" className="view-project">View Project</Link>
        </div>

        {/* Project 3: Hangman */}
        <div className="project-card left-aligned">
          <h3>Hangman</h3>
          <p>A Hangman game built to test users' vocabulary and spelling skills.</p>
          <div className="project-tags">
            <span>JavaScript</span>
            <span>React</span>
            <span>CSS</span>
          </div>
          <Link to="/hangman" className="view-project">View Project</Link>
        </div>
      </div>
    </div>
  );
}

export default Home;
