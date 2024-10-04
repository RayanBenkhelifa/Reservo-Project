import React from "react";
import "../styles.css";

function Contact() {
  return (
    <>
      <header className="header">
        <div className="container">
          <a href="/index" className="header-business-logo">
            {/* Replacing the text with a logo image */}
            <img src="/logo.png" alt="Reservo Logo" className="logo-image" />
          </a>
          <nav className="nav">
            <a href="/index" className="active">
              Home
            </a>
            <a href="/services">Services</a>
            <a href="/contact">Contact</a>
            <a href="/user-type" className="btn">
              Get Started
            </a>
          </nav>
        </div>
      </header>

      <section className="contact">
        <div className="container">
          <h1>Contact Us</h1>
          <p>
            If you have any questions or need support, feel free to reach out to
            us. We're here to help!
          </p>
          <form className="contact-form">
            <input type="text" placeholder="Full Name" required />
            <input type="email" placeholder="Email" required />
            <textarea placeholder="Your Message" required></textarea>
            <button type="submit" className="btn">
              Send Message
            </button>
          </form>
        </div>
      </section>

      <footer className="footer">
        <div className="container">
          <p>© 2024 Reservo. All rights reserved.</p>
        </div>
      </footer>
    </>
  );
}

export default Contact;
