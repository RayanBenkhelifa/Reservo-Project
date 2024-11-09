import CustomerNavBar from "./CustomerNavBar"; // Adjust the path as needed
import React, { useEffect, useState } from "react";
import "../styles.css";

function BrowseBusinesses() {
    const [businesses, setBusinesses] = useState([]); // State to hold businesses
    const [loading, setLoading] = useState(true); // Loading state
    const [error, setError] = useState(null); // Error state
    const [ratings, setRatings] = useState({}); // State to hold average ratings

    useEffect(() => {
        // Fetch businesses from the backend
        const fetchBusinesses = async () => {
            try {
                const response = await fetch("/customer/businesses"); // Make the GET request
                if (!response.ok) {
                    throw new Error("Failed to fetch businesses"); // Throw an error if the response is not ok
                }
                const data = await response.json(); // Parse the JSON response
                setBusinesses(data); // Update the state with the fetched businesses
                setLoading(false); // Set loading to false once the data is fetched

                // Fetch average ratings for businesses
                const ratingsData = {};
                for (const business of data) {
                    try {
                        console.log(`Fetching rating for business: ${business._id}`);
                        const ratingResponse = await fetch(`/api/reviews/average/${business._id}`);
                        const ratingData = await ratingResponse.json();
                        console.log(`Average rating for ${business._id}:`, ratingData.averageRating); // Debug here
                        ratingsData[business._id] = ratingData.averageRating || 0; // Store the average rating
                    } catch (err) {
                        console.error(`Failed to fetch rating for business ${business._id}:`, err);
                        ratingsData[business._id] = 0; // Default to 0 if fetching fails
                    }
                }
                setRatings(ratingsData); // Update ratings state
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
                                <div className="business-card" key={business._id} style={{ position: "relative" }}>
                                    <h3>{business.name}</h3>
                                    <p>Location: {business.location}</p>
                                    <a href={`/business-details/${business._id}`} className="btn">
                                        View Details
                                    </a>
                                    {/* Display Average Rating */}
                                    <div
                                        style={{
                                            position: "absolute",
                                            top: "10px",
                                            right: "10px",
                                            backgroundColor: "#fff",
                                            borderRadius: "50%",
                                            width: "40px",
                                            height: "40px",
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "center",
                                            boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                                            fontWeight: "bold",
                                            color: "#333",
                                        }}
                                    >
                                        {ratings[business._id] !== undefined
                                            ? ratings[business._id].toFixed(1)
                                            : "..."}
                                    </div>
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
