// Modal.js
import React, { useState } from 'react';
import './Modal.css';
import emailjs from 'emailjs-com';

function Modal({ isOpen, onClose }) {
  const [isLoading, setIsLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');

  if (!isOpen) return null;

  const sendEmail = (e) => {
    e.preventDefault();
    setIsLoading(true);

    emailjs.sendForm('service_csi7mwl', 'template_304ts7w', e.target, 'fS5fCp6NoEpBQG9pS')
      .then((result) => {
        setStatusMessage("Message sent successfully!");
        setIsLoading(false);
        e.target.reset();
        onClose(); // Close the modal on success
      }, (error) => {
        setStatusMessage("Failed to send message. Please try again.");
        setIsLoading(false);
      });
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <h3>Let's Connect</h3>
        <form onSubmit={sendEmail} className="contact-form">
          <input type="text" name="name" placeholder="Your Name" required />
          <input type="email" name="email" placeholder="Your Email" required />
          <textarea name="message" placeholder="Your Message" required></textarea>
          <button type="submit" disabled={isLoading}>
            {isLoading ? <div className="spinner"></div> : "Send Message"}
          </button>
        </form>
        <p>{statusMessage}</p>
        <button className="modal-close" onClick={onClose}>✕</button>
      </div>
    </div>
  );
}

export default Modal;
