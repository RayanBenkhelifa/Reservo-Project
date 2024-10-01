import React from 'react';
import '../styles.css';

function BusinessServices() {
  return (
    <div className="dashboard-container">
      <nav className="sidebar">
        <div className="logo">
          <h2>Reservo</h2>
        </div>
        <ul className="nav-links">
          <li><a href="/business-dashboard">Calendar</a></li>
          <li><a href="/business-services">Services</a></li>
          <li><a href="/business-provider">Providers</a></li>
        </ul>
      </nav>

      <div className="main-content">
        <header className="main-header">
          <h1>Add a New Provider</h1>
          <p>Fill out the form below to add a new provider.</p>
        </header>

        <section id="add-provider" className="form-card">
          <form action="/add-provider" method="POST" id="addProviderForm">
            <div className="form-group">
              <label htmlFor="providerName">Provider Name</label>
              <input
                type="text"
                id="providerName"
                name="providerName"
                placeholder="Enter provider name"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="services">Services</label>
              <select id="services" name="serviceIds[]" multiple required>
                <option value="1">Service 1</option>
                <option value="2">Service 2</option>
                <option value="3">Service 3</option>
                <option value="4">Service 4</option>
              </select>
              <small>
                Hold down the Ctrl (Windows) or Command (Mac) button to select multiple services.
              </small>
            </div>

            <button type="submit" className="btn">Add Provider</button>
          </form>
        </section>
      </div>
    </div>
  );
}

export default BusinessServices;
