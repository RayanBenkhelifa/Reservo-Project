import CustomerNavBar from "./CustomerNavBar"; // Adjust the path as needed
import React, { useEffect, useState } from "react";
import "../styles.css";

function BrowseBusinesses() {
  const [businesses, setBusinesses] = useState([]); // State to hold businesses
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState(null); // Error state

  useEffect(() => {
    // Fetch businesses from the backend using the Fetch API
    const fetchBusinesses = async () => {
      try {
        const response = await fetch("/customer/businesses"); // Make the GET request
        if (!response.ok) {
          throw new Error("Failed to fetch businesses"); // Throw an error if the response is not ok
        }
        const data = await response.json(); // Parse the JSON response
        setBusinesses(data); // Update the state with the fetched businesses
        setLoading(false); // Set loading to false once the data is fetched
      } catch (err) {
        console.error(err);
        setError("Failed to load businesses"); // Set the error message in case of failure
        setLoading(false); // Stop loading when error occurs
      }
    };

    fetchBusinesses(); // Call the fetch function when the component mounts
  }, []); // The empty dependency array means this useEffect runs only once after the initial render

  if (loading) {
    return <div>Loading...</div>; // Render this while data is being fetched
  }

  if (error) {
    return <div>{error}</div>; // Render this if there is an error
  }

  // Group businesses by category (assuming each business has a 'category' field)
  const categorizedBusinesses = businesses.reduce((acc, business) => {
    const { category } = business;
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(business);
    return acc;
  }, {});

  return (
    <>
      <CustomerNavBar />
      <div className="container">
        <header className="main-header">
          <h1>Browse Businesses</h1>
          <p>Select a category to explore businesses near you.</p>
        </header>

        {/* Render categories dynamically */}
        {Object.keys(categorizedBusinesses).map((category) => (
          <section
            key={category}
            id={category.toLowerCase()}
            className="business-category"
          >
            <h2>{category}</h2>
            <div className="business-list">
              {categorizedBusinesses[category].map((business) => (
                <div className="business-card" key={business._id}>
                  <h3>{business.name}</h3>
                  <p>Location: {business.location}</p>
                  <a href={`/business-details/${business._id}`} className="btn">
                    View Details
                  </a>
                </div>
              ))}
            </div>
          </section>
        ))}
      </div>
    </>
  );
}

export default BrowseBusinesses;
