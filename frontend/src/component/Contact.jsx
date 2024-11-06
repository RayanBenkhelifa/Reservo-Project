import React from "react";
import CustomerNavBar from "./CustomerNavBar"; // Adjust the path as needed
import "../styles.css";

function Contact() {
  return (
    <>
      <CustomerNavBar />

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
