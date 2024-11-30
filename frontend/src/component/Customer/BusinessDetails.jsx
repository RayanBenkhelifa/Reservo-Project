import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom"; // Use Link for navigation
import CustomerNavBar from "./CustomerNavBar"; // Adjust the path as needed

const BusinessDetails = () => {
  const { businessId } = useParams(); // Get the business id from the URL
  const [business, setBusiness] = useState(null);
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch business details and services using the business id
  useEffect(() => {
    const fetchBusinessDetails = async () => {
      try {
        const response = await fetch(
          `/customer/businesses/${businessId}/services`
        );
        const servicesData = await response.json();

        if (response.ok) {
          setServices(servicesData); // Update the state with fetched services
        } else {
          setError("Failed to fetch services");
        }

        setLoading(false);
      } catch (err) {
        console.error(err);
        setError("Failed to load business details");
        setLoading(false);
      }
    };

    fetchBusinessDetails();
  }, [businessId]);

  if (loading) {
    return <p>Loading business details...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <>
      <CustomerNavBar />
      <div className="container">
        <header className="business-header">
          <h1>{business?.businessName || "Business Name"}</h1>
          <p>Location: {business?.location || "Location"}</p>
          <p>Opening Hours: {business?.openingHours || "Opening Hours"}</p>
        </header>

        <section id="services" className="service-category">
          <h2>Available Services</h2>
          <div className="service-list">
            {services.length > 0 ? (
              services.map((service) => (
                <div className="service-card" key={service._id}>
                  <h3>{service.serviceName}</h3>
                  <p>Description: {service.description}</p>
                  <p>Duration: {service.duration} minutes</p>
                  <p>Price: ${service.price}</p>

                  {/* Pass businessId, serviceId, and serviceDuration to BusinessProvider */}
                  <Link
                    to={`/business-provider/${businessId}/${service._id}?duration=${service.duration}`}
                    className="btn"
                  >
                    Book Now
                  </Link>
                </div>
              ))
            ) : (
              <p>No services available for this business.</p>
            )}
          </div>
        </section>
      </div>
    </>
  );
};

export default BusinessDetails;
