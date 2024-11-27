import React, { useEffect, useState } from "react";
import BusinessNavBar from "./BusinessNavBar";
import "../styles.css";

const ReviewFeedback = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        console.log("Fetching reviews...");
        const response = await fetch("http://localhost:5000/review/business-reviews", {
          method: "GET",
          credentials: "include", // Include cookies for session handling
        });

        if (!response.ok) {
          throw new Error(`Failed to fetch reviews: ${response.statusText}`);
        }

        const data = await response.json();
        console.log("Fetched reviews:", data.reviews);
        setReviews(data.reviews);
      } catch (error) {
        console.error("Error fetching reviews:", error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, []);

  return (
    <div className="review-feedback-page-container">
      <BusinessNavBar />
      <div className="review-feedback-page">
        <h1>Review Feedback</h1>
        {loading ? (
          <p>Loading...</p>
        ) : error ? (
          <p style={{ color: "red" }}>{error}</p>
        ) : reviews.length > 0 ? (
          <table className="review-feedback-table">
            <thead>
              <tr>
                <th>Business Rating</th>
                <th>Provider Rating</th>
                <th>Comment</th>
              </tr>
            </thead>
            <tbody>
              {reviews.map((review) => (
                <tr key={review._id}>
                  <td>{review.businessRating || "N/A"}</td>
                  <td>{review.providerRating || "N/A"}</td>
                  <td>{review.comment || "No comment provided"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No reviews found for your business.</p>
        )}
      </div>
    </div>
  );
};

export default ReviewFeedback;
