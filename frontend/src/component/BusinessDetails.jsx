import React, { useState, useEffect } from 'react';
import '../styles.css'; // Ensure your CSS file is linked

const BusinessDetails = () => {
  // Set initial state for business and services
  const [business, setBusiness] = useState(null);
  const [services, setServices] = useState([]);

  // Simulate fetching business data
  useEffect(() => {
    // Here you would normally fetch data from an API
    const fetchBusinessDetails = async () => {
      // Simulating fetching data from API
      const businessData = {
        businessName: 'Example Barber Shop',
        location: 'Downtown',
        openingHours: '9:00 AM - 5:00 PM',
      };
      const servicesData = [
        {
          _id: 1,
          serviceName: 'Haircut',
          description: 'Professional haircut and styling',
          duration: 30,
          price: 50,
        },
        {
          _id: 2,
          serviceName: 'Shaving',
          description: 'Beard shaving and trimming',
          duration: 45,
          price: 35,
        },
        {
          _id: 3,
          serviceName: 'Full Grooming',
          description: 'Complete grooming package',
          duration: 60,
          price: 80,
        },
      ];

      setBusiness(businessData);
      setServices(servicesData);
    };

    fetchBusinessDetails();
  }, []);

  return (
    <div className="container">
      {/* Render business details */}
      {business ? (
        <>
          <header className="business-header">
            <h1>{business.businessName}</h1>
            <p>Location: {business.location}</p>
            <p>Opening Hours: {business.openingHours}</p>
          </header>

          {/* Render service list */}
          <section id="services" className="service-category">
            <h2>Available Services</h2>
            <div className="service-list">
              {services.map((service) => (
                <div className="service-card" key={service._id}>
                  <h3>{service.serviceName}</h3>
                  <p>Description: {service.description}</p>
                  <p>Duration: {service.duration} minutes</p>
                  <p>Price: ${service.price}</p>
                  <a href={`/select-provider/${service._id}`} className="btn">
                    Book Now
                  </a>
                </div>
              ))}
            </div>
          </section>
        </>
      ) : (
        <p>Loading business details...</p>
      )}
    </div>
  );
};

export default BusinessDetails;
