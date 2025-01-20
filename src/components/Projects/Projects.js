import React from 'react';
import './Projects.css';
import { Link } from 'react-router-dom';
import TorqeedoPreview from '/src/assets/images/torqeedo-preview.jpg'
import SudokuPreview from '/src/assets/images/sudoku-preview.jpg'

const projects = [
  {
    title: 'Sudoku',
    description: 'Developing the Sudoku game required handling responsive layouts, implementing a number selection feature, and fine-tuning themes.',
    tags: ['React', 'JavaScript', 'CSS'],
    link: '/sudoku', // Internal link
    image: SudokuPreview,
  },
  {
    title: 'Jigsaw Puzzle',
    description: 'Challenges included draggable pieces, scaling for screens, and grouping connected pieces for joint movement.',
    tags: ['React', 'JavaScript', 'CSS'],
    link: '/jigsaw', // Internal link
    image: SudokuPreview,
  },
  {
    title: 'Hangman',
    description: 'Integrated an API to fetch words dynamically, designed a responsive UI, and ensured smooth interaction logic.',
    tags: ['JavaScript', 'React', 'CSS', 'API'],
    link: '/hangman', // Internal link
    image: '/assets/images/hangman-preview.jpg',
  },
  {
    title: 'Torqeedo',
    description: 'Built a multilingual website using Odoo 18, PSQL, and NGINX, published on a VPS in just 2 weeks.',
    tags: ['Odoo 18', 'NGINX', 'PSQL'],
    link: 'https://torqeedo.si', // External link
    image: TorqeedoPreview,
  },
];

const Projects = () => {
  return (
    <div className="projects-section">
      <h2 className="projects-section__heading">My Projects</h2>
      <div className="projects-grid">
        {projects.map((project, index) => (
          <div key={index} className="projects-card">
            <img
              src={project.image}
              alt={`${project.title} preview`}
              className="projects-card__image"
            />
            <div className="projects-card__content">
              <h3 className="projects-card__title">{project.title}</h3>
              <p className="projects-card__description">{project.description}</p>
              <div className="projects-card__tags">
                {project.tags.map((tag, tagIndex) => (
                  <span key={tagIndex} className="projects-card__tag">
                    {tag}
                  </span>
                ))}
              </div>
              {project.link.startsWith('http') ? (
                <a
                  href={project.link}
                  className="projects-card__link"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  View Project
                </a>
              ) : (
                <Link to={project.link} className="projects-card__link">
                  View Project
                </Link>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Projects;
