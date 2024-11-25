import React, { useState } from 'react';
import emailjs from 'emailjs-com';
import './Home.css';
import { Link } from 'react-router-dom';
import mitjadragan from '../assets/images/mitjadragan.jpg';
import testimage from '../assets/images/AvatarMaker.png'

function Home() {
  const [statusMessage, setStatusMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const sendEmail = (e) => {
    e.preventDefault();
    setIsLoading(true);

    emailjs.sendForm('service_csi7mwl', 'template_304ts7w', e.target, 'fS5fCp6NoEpBQG9pS')
      .then((result) => {
        setStatusMessage("Message sent successfully!");
        setIsLoading(false);
        e.target.reset();
      }, (error) => {
        setStatusMessage("Failed to send message. Please try again.");
        setIsLoading(false);
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
              in both my professional and personal life. Currently employed as a IT Manager/FullStack Developer in Delta Team d.o.o. which is a Yamaha Motor dealership for the
              entire balkan region.
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
                <div className="spinner"></div>
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
          <p>    
            Developing the Sudoku game required handling responsive layouts for the grid, 
            implementing an intuitive number selection feature, and fine-tuning a light/dark 
            theme toggle that adapts dynamically to user preferences.
          </p>
          <div className="project-tags">
            <span>React</span>
            <span>JavaScript</span>
            <span>CSS</span>
          </div>
          <Link to="/sudoku" className="view-project">View Project</Link>
        </div>

        {/* Project 2: Jigsaw Puzzle */}
        <div className="project-card right-aligned">
          <h3>Jigsaw Puzzle</h3>
          <p>
            The Jigsaw Puzzle game presented challenges such as ensuring draggable pieces
            snapped correctly to their positions, scaling pieces for different screen sizes, 
            and implementing logic for grouping connected pieces for joint movement.
          </p>
          <div className="project-tags">
            <span>React</span>
            <span>JavaScript</span>
            <span>CSS</span>
          </div>
          <Link to="/jigsaw" className="view-project">View Project</Link>
        </div>

        {/* Project 3: Hangman */}
        <div className="project-card left-aligned">
          <h3>Hangman</h3>
          <p>
            Building the Hangman game involved integrating an API to dynamically fetch 
            words, designing a responsive UI for different screen sizes, and ensuring 
            smooth interaction logic for a seamless user experience.
          </p>
          <div className="project-tags">
            <span>JavaScript</span>
            <span>React</span>
            <span>CSS</span>
            <span>API</span>
          </div>
          <Link to="/hangman" className="view-project">View Project</Link>
        </div>

        {/* Project 4: Torqeedo */}
        <div className="project-card right-aligned">
          <h3>Torqeedo</h3>
          <p>
            Yamaha starts a partnership with Torqeedo. Building a multilingual website
            on a VPS linux Server. Using Odoo 18, PSQL and NGINX published a website in
            a span of 2 weeks.
          </p>
          <div className="project-tags">
            <span>Odoo 18</span>
            <span>NGINX</span>
            <span>PSQL</span>
          </div>
          <Link to="https://torqeedo.si" className="view-project">View Project</Link>
        </div>
      </div>
    </div>
  );
}

export default Home;
