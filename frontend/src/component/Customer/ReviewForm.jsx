// ReviewForm.jsx
import React, { useState } from "react";
import ReactStars from "react-rating-stars-component";

const ReviewForm = ({ bookingId, handleReviewSubmit }) => {
  const [businessRating, setBusinessRating] = useState(5);
  const [providerRating, setProviderRating] = useState(5);
  const [comment, setComment] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    handleReviewSubmit(bookingId, businessRating, providerRating, comment);
  };

  return (
    <form className="review-form" onSubmit={handleSubmit}>
      <div className="rating-group">
        <label>Business Rating:</label>
        <ReactStars
          count={5}
          onChange={setBusinessRating}
          size={40} // Adjust the size as needed
          isHalf={false}
          value={businessRating}
          activeColor="#ffd700"
        />
      </div>
      <div className="rating-group">
        <label>Provider Rating:</label>
        <ReactStars
          count={5}
          onChange={setProviderRating}
          size={40} // Adjust the size as needed
          isHalf={false}
          value={providerRating}
          activeColor="#ffd700"
        />
      </div>
      <label>
        Comment:
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Leave a comment..."
        />
      </label>
      <button type="submit" className="btn">
        Submit Review
      </button>
    </form>
  );
};

export default ReviewForm;
