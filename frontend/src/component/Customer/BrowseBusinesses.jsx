// src/components/BrowseBusinesses.js

import React, { useEffect, useState } from "react";
import CustomerNavBar from "./CustomerNavBar";
// Import FontAwesome icons (if not already included)
import { FaMapMarkerAlt, FaClock, FaStar } from "react-icons/fa";
// Import the default image
import defaultImage from "../../img/default.jpg";

function BrowseBusinesses() {
  const [businesses, setBusinesses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [ratings, setRatings] = useState({});
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    const fetchBusinessesAndRatings = async () => {
      try {
        const response = await fetch("/customer/businesses");
        if (!response.ok) {
          throw new Error("Failed to fetch businesses");
        }
        const data = await response.json();

        const businessDataWithImages = await Promise.all(
          data.map(async (business) => {
            const imageResponse = await fetch(
              `/business/image/${business._id}`
            );
            if (imageResponse.ok) {
              const imageData = await imageResponse.json();
              return { ...business, imageUrl: imageData.imageUrl };
            } else {
              return { ...business, imageUrl: "" };
            }
          })
        );

        setBusinesses(businessDataWithImages);

        const ratingsData = {};
        const ratingPromises = businessDataWithImages.map(async (business) => {
          try {
            const ratingResponse = await fetch(
              `/review/average/${business._id}`
            );
            if (ratingResponse.ok) {
              const ratingData = await ratingResponse.json();
              ratingsData[business._id] = ratingData.averageRating || 0;
            } else {
              ratingsData[business._id] = 0;
            }
          } catch (err) {
            console.error(
              `Error fetching rating for business ${business._id}:`,
              err
            );
            ratingsData[business._id] = 0;
          }
        });

        await Promise.all(ratingPromises);
        setRatings(ratingsData);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching businesses or images:", err);
        setError("Failed to load businesses");
        setLoading(false);
      }
    };

    fetchBusinessesAndRatings();
  }, []);

  // Group businesses by category
  const categorizedBusinesses = businesses.reduce((acc, business) => {
    const { category } = business;
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(business);
    return acc;
  }, {});

  const handleToggle = () => {
    setIsExpanded(!isExpanded);
  };
  return (
    <>
      <CustomerNavBar />
      <div className="container">
        <header className="main-header">
          <h1>Browse Businesses</h1>
          <p>Select a category to explore businesses near you.</p>
        </header>

        {loading ? (
          // Render skeletons when loading
          <div className="business-list">
            {Array.from({ length: 6 }).map((_, index) => (
              <SkeletonCard key={index} />
            ))}
          </div>
        ) : error ? (
          <div>{error}</div>
        ) : (
          // Render categories and businesses when data is loaded
          Object.keys(categorizedBusinesses).map((category) => (
            <section
              key={category}
              id={category.toLowerCase()}
              className="business-category"
            >
              <h2>{category}</h2>
              <div className="business-list">
                {categorizedBusinesses[category].map((business) => (
                  <div className="business-card" key={business._id}>
                    {/* Business Image and Rating */}
                    <div className="business-card-image">
                      <img
                        src={business.imageUrl || defaultImage}
                        alt={`${business.businessName}`}
                      />
                      <div className="business-card-rating">
                        {ratings[business._id] !== undefined ? (
                          <>
                            <span>{ratings[business._id].toFixed(1)}</span>
                            <FaStar color="#FFD700" />
                          </>
                        ) : (
                          "..."
                        )}
                      </div>
                    </div>

                    {/* Business Details */}
                    <div className="business-card-content">
                      <h3>{business.businessName}</h3>
                      <p className="business-category-name">
                        {business.category}
                      </p>
                      <p className="business-description">
                        {isExpanded
                          ? business.description
                          : business.description.length > 100
                          ? business.description.substring(0, 100) + "..."
                          : business.description}
                      </p>
                      {business.description.length > 100 && (
                        <button
                          onClick={handleToggle}
                          className="read-more-btn"
                        >
                          {isExpanded ? "Read Less" : "Read More"}
                        </button>
                      )}
                      <p className="business-location">
                        <FaMapMarkerAlt /> {business.location}
                      </p>
                      <p className="business-operating-hours">
                        <FaClock /> {business.operatingHours.start} -{" "}
                        {business.operatingHours.end}
                      </p>
                      <a
                        href={`/business-details/${business._id}`}
                        className="btn"
                      >
                        View Details
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          ))
        )}
      </div>
    </>
  );
}

// SkeletonCard Component
function SkeletonCard() {
  return (
    <div className="business-card skeleton-card">
      <div className="business-card-image skeleton-image"></div>
      <div className="business-card-content">
        <div className="skeleton-text skeleton-title"></div>
        <div className="skeleton-text skeleton-category"></div>
        <div className="skeleton-text skeleton-description"></div>
        <div className="skeleton-text skeleton-location"></div>
        <div className="skeleton-text skeleton-hours"></div>
        <div className="skeleton-button"></div>
      </div>
    </div>
  );
}

export default BrowseBusinesses;
