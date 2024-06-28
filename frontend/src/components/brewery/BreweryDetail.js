import  { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import ReviewList from './ReviewList';
import ReviewForm from './ReviewForm';

const BreweryDetail = () => {
  const { id } = useParams();
  const [brewery, setBrewery] = useState(null);
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    const loadBrewery = async () => {
      const response = await fetch(`https://api.openbrewerydb.org/breweries/${id}`);
      const data = await response.json();
      setBrewery(data);
    };

    const loadReviews = async () => {
      const response = await fetch(`https://moengage-assignment.onrender.com/api/breweries/${id}/reviews`);
      const data = await response.json();
      setReviews(data);
    };

    loadBrewery();
    loadReviews();
  }, [id]);

  return (
    <div className="brewery-detail-container">
      {brewery && (
        <div className="brewery-detail">
          <h2>{brewery.name}</h2>
          <p>{brewery.street}, {brewery.city}, {brewery.state}</p>
          <p>{brewery.phone}</p>
          <p><a href={brewery.website_url} target="_blank" rel="noopener noreferrer">{brewery.website_url}</a></p>
        </div>
      )}
      <ReviewList reviews={reviews} />
      <ReviewForm breweryId={id} setReviews={setReviews} />
    </div>
  );
};

export default BreweryDetail;
