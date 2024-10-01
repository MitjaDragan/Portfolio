import React from 'react';
import './Certifications.css';

const certifications = [
  {
    title: 'Full-Stack Engineer',
    date: 'March 2024',
    url: 'https://www.codecademy.com/profiles/MDragan/certificates/ffd0f42cce1a44e9a0108b365047a0a6',
  },
  {
    title: 'Front-End Engineer Career Path',
    date: 'October 2023',
    url: 'https://www.codecademy.com/profiles/MDragan/certificates/5f85dd867b67b60014ac9ea3',
  },,
  {
    title: 'Learn React Course',
    date: 'August 2024',
    url: 'https://www.codecademy.com/profiles/MDragan/certificates/af00e5032d0a68cc84879983f5d8333b',
  },,
  {
    title: 'Learn Advance React',
    date: 'August 2024',
    url: 'https://www.codecademy.com/profiles/MDragan/certificates/13ffe064f6504262a9e9e3cf76be9bf3',
  },,
  {
    title: 'Data Engineer',
    date: 'August 2024',
    url: 'https://www.codecademy.com/profiles/MDragan/certificates/a0ea6712a909402896de2c6772445311',
  },
  // Add more certifications as needed
];

const Certifications = () => {
  return (
    <div className="certifications">
      <h2>Certifications</h2>
      <ul>
        {certifications.map((cert, index) => (
          <li key={index}>
            <h3>{cert.title}</h3>
            <p>Date: {cert.date}</p>
            <a href={cert.url} target="_blank" rel="noopener noreferrer">
              View Certification
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Certifications;
