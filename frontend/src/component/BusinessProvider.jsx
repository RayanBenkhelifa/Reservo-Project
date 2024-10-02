import { useParams, useLocation, Link } from "react-router-dom";
import { useEffect, useState } from "react";

const BusinessProvider = () => {
  const { businessId, serviceId } = useParams(); // Extract businessId and serviceId from URL params
  const location = useLocation(); // Get query parameters from URL

  // Parse the query parameters to get serviceDuration
  const queryParams = new URLSearchParams(location.search);
  const serviceDuration = queryParams.get("duration"); // Extract the service duration
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [providers, setProviders] = useState([]);

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
                {/* Safely check if provider.services exists before accessing length */}
                <p>
                  Available Services:{" "}
                  {provider.services
                    ? provider.services.length
                    : "No services available"}
                </p>

                {/* Pass providerId in the URL and serviceId, serviceDuration as query params */}
                <Link
                  to={`/time-slots/${provider._id}?serviceId=${serviceId}&duration=${serviceDuration}`}
                  className="btn"
                >
                  Book {provider.name}
                </Link>
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
