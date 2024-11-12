import React, { useEffect, useState } from "react";
import CustomerNavBar from "./CustomerNavBar"; // Adjust the path as needed
import "../styles.css";

function BrowseBusinesses() {
    const [businesses, setBusinesses] = useState([]); // State to hold businesses
    const [loading, setLoading] = useState(true); // Loading state
    const [error, setError] = useState(null); // Error state
    const [ratings, setRatings] = useState({}); // State to hold average ratings

    useEffect(() => {
        const fetchBusinessesAndRatings = async () => {
            try {
                // Fetch businesses from the backend
                const response = await fetch("/customer/businesses");
                if (!response.ok) {
                    throw new Error("Failed to fetch businesses");
                }
                const data = await response.json();
                console.log("Businesses fetched:", data); // Debug log for businesses
                setBusinesses(data);

                // Fetch average ratings for all businesses in parallel
                const ratingsData = {};
                const ratingPromises = data.map(async (business) => {
                    try {
                        const ratingResponse = await fetch(`/review/average/${business._id}`); // Corrected API path
                        if (ratingResponse.ok) {
                            const ratingData = await ratingResponse.json();
                            console.log(`Average rating for ${business._id}:`, ratingData); // Debug log for each rating
                            ratingsData[business._id] = ratingData.averageRating || 0;
                        } else {
                            console.error(`Failed to fetch average rating for ${business._id}`);
                            ratingsData[business._id] = 0; // Default to 0 if the API response fails
                        }
                    } catch (err) {
                        console.error(`Error fetching rating for business ${business._id}:`, err);
                        ratingsData[business._id] = 0; // Default to 0 on error
                    }
                });

                // Wait for all promises to resolve before updating the state
                await Promise.all(ratingPromises);
                console.log("All ratings fetched:", ratingsData); // Debug log for all ratings
                setRatings(ratingsData); // Update the ratings state
                setLoading(false); // Stop loading
            } catch (err) {
                console.error("Error fetching businesses or ratings:", err);
                setError("Failed to load businesses");
                setLoading(false); // Stop loading in case of error
            }
        };

        fetchBusinessesAndRatings();
    }, []); // Run once on component mount

    if (loading) {
        return <div>Loading...</div>; // Show loading spinner or text
    }

    if (error) {
        return <div>{error}</div>; // Display error message
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
                                <div
                                    className="business-card"
                                    key={business._id}
                                    style={{ position: "relative" }}
                                >
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
                                            width: "60px", // Adjusted width for star symbol
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
                                            ? (
                                                <>
                                                    {ratings[business._id].toFixed(1)}{" "}
                                                    <span style={{ color: "#FFD700", marginLeft: "2px" }}>⭐</span>
                                                </>
                                            )
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
