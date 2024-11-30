import React, { useState, useEffect } from "react";
import "../styles.css"; // Ensure your CSS file is linked

const SelectProvider = () => {
  // State to store the providers
  const [providers, setProviders] = useState([]);

  // Simulate fetching providers data
  useEffect(() => {
    // In a real app, you'd fetch this data from an API
    const fetchProviders = async () => {
      const providersData = [
        {
          _id: 1,
          name: "Provider 1",
          availability: "9:00 AM - 12:00 PM",
        },
        {
          _id: 2,
          name: "Provider 2",
          availability: "1:00 PM - 5:00 PM",
        },
        {
          _id: 3,
          name: "Provider 3",
          availability: "2:00 PM - 6:00 PM",
        },
      ];
      setProviders(providersData);
    };

    fetchProviders();
  }, []);

  return (
    <div className="container">
      {/* Header Section */}
      <header className="provider-header">
        <h1>Select a Provider</h1>
        <p>Please choose a provider for your selected service.</p>
      </header>

      {/* Providers List */}
      <section id="providers" className="provider-category">
        <h2>Available Providers</h2>
        <div className="provider-list">
          {providers.length > 0 ? (
            providers.map((provider) => (
              <div className="provider-card" key={provider._id}>
                <h3>{provider.name}</h3>
                <p>Availability: {provider.availability}</p>
                <a href={`/timeslots/${provider._id}`} className="btn">
                  Select Provider
                </a>
              </div>
            ))
          ) : (
            <p>Loading providers...</p>
          )}
        </div>
      </section>
    </div>
  );
};

export default SelectProvider;
