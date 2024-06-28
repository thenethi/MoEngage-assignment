const ReviewList = ({ reviews }) => (
  <div>
    <h3>Reviews</h3>
    <ul>
      {reviews.map(review => (
        <li key={review._id}>
          <strong>Rating: {review.rating}</strong>
          <p>{review.description}</p>
        </li>
      ))}
    </ul>
  </div>
);

export default ReviewList;
