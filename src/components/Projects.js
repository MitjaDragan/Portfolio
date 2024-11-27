import React from 'react';
import './Projects.css';
import { Link } from 'react-router-dom';

const projects = [
  {
    title: 'Sudoku',
    description: 'Developing the Sudoku game required handling responsive layouts, implementing a number selection feature, and fine-tuning themes.',
    tags: ['React', 'JavaScript', 'CSS'],
    link: '/sudoku',
  },
  {
    title: 'Jigsaw Puzzle',
    description: 'Challenges included draggable pieces, scaling for screens, and grouping connected pieces for joint movement.',
    tags: ['React', 'JavaScript', 'CSS'],
    link: '/jigsaw',
  },
  {
    title: 'Hangman',
    description: 'Integrated an API to fetch words dynamically, designed a responsive UI, and ensured smooth interaction logic.',
    tags: ['JavaScript', 'React', 'CSS', 'API'],
    link: '/hangman',
  },
  {
    title: 'Torqeedo',
    description: 'Built a multilingual website using Odoo 18, PSQL, and NGINX, published on a VPS in just 2 weeks.',
    tags: ['Odoo 18', 'NGINX', 'PSQL'],
    link: 'https://torqeedo.si',
  },
];

const Projects = () => {
  return (
    <div className="projects-container">
      <h2 className="projects-heading">Projects</h2>
      <div className="card-stack">
        {projects.map((project, index) => (
          <div key={index} className="project-card">
            <h3>{project.title}</h3>
            <p>{project.description}</p>
            <div className="project-tags">
              {project.tags.map((tag, tagIndex) => (
                <span key={tagIndex} className="project-tag">
                  {tag}
                </span>
              ))}
            </div>
            <Link to={project.link} className="project-link">
              View Project
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Projects;
