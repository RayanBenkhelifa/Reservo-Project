import React from 'react';
import '../styles.css';

function BrowseBusinesses() {
  return (
    <div className="container">
      <header className="main-header">
        <h1>Browse Businesses</h1>
        <p>Select a category to explore businesses near you.</p>
      </header>

      {/* Barber Shops Section */}
      <section id="barber-shops" className="business-category">
        <h2>Barber Shops</h2>
        <div className="business-list">
          {/* Business cards could be dynamically rendered here */}
          <div className="business-card">
            <h3>Barber Shop 1</h3>
            <p>Location: Downtown</p>
            <a href="/business-details/1" className="btn">View Details</a>
          </div>
          <div className="business-card">
            <h3>Barber Shop 2</h3>
            <p>Location: Uptown</p>
            <a href="/business-details/2" className="btn">View Details</a>
          </div>
        </div>
      </section>

      {/* Salons Section */}
      <section id="salons" className="business-category">
        <h2>Salons</h2>
        <div className="business-list">
          <div className="business-card">
            <h3>Salon 1</h3>
            <p>Location: City Center</p>
            <a href="/business-details/3" className="btn">View Details</a>
          </div>
          <div className="business-card">
            <h3>Salon 2</h3>
            <p>Location: Suburb</p>
            <a href="/business-details/4" className="btn">View Details</a>
          </div>
        </div>
      </section>

      {/* Spas Section */}
      <section id="spas" className="business-category">
        <h2>Spas</h2>
        <div className="business-list">
          <div className="business-card">
            <h3>Spa 1</h3>
            <p>Location: Lakeside</p>
            <a href="/business-details/5" className="btn">View Details</a>
          </div>
          <div className="business-card">
            <h3>Spa 2</h3>
            <p>Location: Riverside</p>
            <a href="/business-details/6" className="btn">View Details</a>
          </div>
        </div>
      </section>
    </div>
  );
}

export default BrowseBusinesses;
