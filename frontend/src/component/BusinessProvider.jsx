import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom"; // To get businessId and serviceId from the URL
import "../styles.css"; // Ensure your CSS file is linked

const BusinessProvider = () => {
  const { businessId, serviceId } = useParams(); // Get the businessId and serviceId from the URL
  const [providers, setProviders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch providers for the selected business and service
  useEffect(() => {
    const fetchProviders = async () => {
      try {
        const response = await fetch(
          `/customer/businesses/${businessId}/services/${serviceId}/providers`
        );
        const providersData = await response.json();

        if (response.ok) {
          setProviders(providersData); // Update the state with fetched providers
        } else {
          setError("Failed to fetch providers");
        }

        setLoading(false);
      } catch (err) {
        console.error(err);
        setError("Failed to load providers");
        setLoading(false);
      }
    };

    fetchProviders();
  }, [businessId, serviceId]);

  if (loading) {
    return <p>Loading providers...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <div className="container">
      <header className="main-header">
        <h1>Available Providers for Service</h1>
      </header>

      <section id="providers" className="service-category">
        <h2>Providers</h2>
        <div className="service-list">
          {providers.length > 0 ? (
            providers.map((provider) => (
              <div className="service-card" key={provider._id}>
                <h3>{provider.name}</h3>
                <p>Available Services: {provider.services.length}</p>
                <button className="btn">Book {provider.name}</button>
              </div>
            ))
          ) : (
            <p>No providers available for this service.</p>
          )}
        </div>
      </section>
    </div>
  );
};

export default BusinessProvider;
