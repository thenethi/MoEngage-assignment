import  { useState } from 'react';
import { Redirect } from 'react-router-dom';
import Cookie from 'js-cookie';
import { Oval } from 'react-loader-spinner';

const ReviewForm = ({ breweryId, setReviews }) => {
  const [rating, setRating] = useState(1);
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); 
    const tokenCookie = Cookie.get("jwt_token");
    if (!tokenCookie) {
      console.error('Token cookie not found');
      setLoading(false); 
      return <Redirect to="/login"/>;
    }
    const token = tokenCookie;
    const userId = getUserId(); 

    const response = await fetch(`https://moengage-assignment.onrender.com/api/breweries/${breweryId}/reviews`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
      body: JSON.stringify({ userId, rating, description }), 
    });

    if (!response.ok) {
      console.error('Failed to submit review:', response.statusText);
      setLoading(false); // Stop loading if error
      return;
    }

    const data = await response.json();
    setReviews(prevReviews => [...prevReviews, data]);
    setRating(1);
    setDescription('');
    setLoading(false);
  };

  const getUserId = () => {
    return Cookie.get("user_id"); 
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>
        Rating:
        <select value={rating} onChange={(e) => setRating(e.target.value)}>
          {[1, 2, 3, 4, 5].map(num => (
            <option key={num} value={num}>{num}</option>
          ))}
        </select>
      </label>
      <label>
        Description:
        <textarea value={description} onChange={(e) => setDescription(e.target.value)} required></textarea>
      </label>
      <button type="submit" disabled={loading} className="submit-button">
        {loading ? (
          <div className="loader-container">
            <Oval
              height={20}
              width={20}
              color="#fff"
              visible={true}
              ariaLabel='oval-loading'
              secondaryColor="#007BFF"
              strokeWidth={2}
              strokeWidthSecondary={2}
            />
          </div>
        ) : (
          'Submit Review'
        )}
      </button>
    </form>
  );
};

export default ReviewForm;
