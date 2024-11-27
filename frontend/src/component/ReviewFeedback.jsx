import React, { useEffect, useState } from "react";
import BusinessNavBar from "./BusinessNavBar";
import "../styles.css";  // Ensure the styles are imported

const ReviewFeedback = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [feedbacks, setFeedbacks] = useState({}); // To store feedback for each customer
  const [submittedFeedback, setSubmittedFeedback] = useState({}); // To track feedback submission for each review

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await fetch("/review/business-reviews", {
          method: "GET",
          credentials: "include", // Include cookies for session handling
        });

        if (!response.ok) {
          throw new Error(`Failed to fetch reviews: ${response.statusText}`);
        }

        const data = await response.json();
        setReviews(data.reviews);
        const storedFeedbackStatus = JSON.parse(localStorage.getItem("submittedFeedback")) || {};
        setSubmittedFeedback(storedFeedbackStatus);

      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, []);

  // Handle textarea change
  const handleFeedbackChange = (reviewId, value) => {
    setFeedbacks({
      ...feedbacks,
      [reviewId]: value, // Store feedback for each review
    });
  };

  // Handle feedback submission
  const handleFeedbackSubmit = async (reviewId, customerId) => {
    try {
      const feedbackMessage = feedbacks[reviewId];

      // Make API request to submit feedback
      const response = await fetch(`/review/submit-feedback`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          reviewId,
          customerId,
          feedbackMessage,
        }),
      });

      if (!response.ok) {
        throw new Error(`Failed to send feedback: ${response.statusText}`);
      }

      setSubmittedFeedback((prevState) => ({
        ...prevState,
        [reviewId]: true, // Feedback is submitted for this review
      }));

      localStorage.setItem("submittedFeedback", JSON.stringify({
        ...submittedFeedback,
        [reviewId]: true,
      }));

      alert("Feedback sent successfully!");
    } catch (error) {
      alert(`Error sending feedback: ${error.message}`);
    }
  };

  return (
    <div className="review-feedback-page"> {/* Ensure this class is applied to the parent container */}
      <div className="sidebar">
        <BusinessNavBar />
      </div>
      <div className="review-feedback-content">
        <div className="review-feedback-card">
          <h1>Review Feedback</h1>
          {loading ? (
            <p>Loading...</p>
          ) : error ? (
            <p style={{ color: "red" }}>{error}</p>
          ) : reviews.length > 0 ? (
            <table className="review-feedback-table">
              <thead>
                <tr>
                  <th>Customer Name</th>
                  <th>Business Rating</th>
                  <th>Provider Rating</th>
                  <th>Comment</th>
                  <th>Feedback</th>
                </tr>
              </thead>
              <tbody>
                {reviews.map((review) => (
                  <tr key={review._id}>
                    <td>{review.customer ? review.customer.name : "Unknown"}</td>
                    <td>{review.businessRating || "N/A"}</td>
                    <td>{review.providerRating || "N/A"}</td>
                    <td>{review.comment || "No comment provided"}</td>
                    <td>
                      {submittedFeedback[review._id] ? (
                        <p>Feedback Given</p>
                      ) : (
                        <>
                          <textarea
                            value={feedbacks[review._id] || ""}
                            onChange={(e) => handleFeedbackChange(review._id, e.target.value)}
                            placeholder="Write your feedback here..."
                          />
                          <button onClick={() => handleFeedbackSubmit(review._id, review.customer._id)}>
                            Send Feedback
                          </button>
                        </>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p>No reviews found for your business.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ReviewFeedback;
