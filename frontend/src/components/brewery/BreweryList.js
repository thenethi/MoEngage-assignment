import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Oval } from 'react-loader-spinner';

const BreweryList = () => {
  const [breweries, setBreweries] = useState([]);
  const [query, setQuery] = useState('');
  const [searchBy, setSearchBy] = useState('city');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadBreweries = async () => {
      setLoading(true);
      let endpoint = `https://api.openbrewerydb.org/breweries`;

      if (query && searchBy === 'city') {
        endpoint += `?by_city=${query}`;
      } else if (query && searchBy === 'name') {
        endpoint += `?by_name=${query}`;
      } else if (query && searchBy === 'type') {
        endpoint += `?by_type=${query}`;
      }

      try {
        const response = await fetch(endpoint);
        if (response.ok) {
          const data = await response.json();
          setBreweries(data);
        } else {
          throw new Error('Failed to fetch breweries');
        }
      } catch (error) {
        console.error('Error fetching breweries:', error.message);
      }
      setLoading(false);
    };

    if (query) {
      loadBreweries();
    } else {
      setBreweries([]);
      setLoading(false);
    }
  }, [query, searchBy]);

  const handleSearchByChange = (event) => {
    setSearchBy(event.target.value);
    setQuery('');
  };

  return (
    <div className="brewery-list-container">
      <div className="brewery-list">
        <select value={searchBy} onChange={handleSearchByChange}>
          <option value="city">City</option>
          <option value="name">Name</option>
          <option value="type">Type</option>
        </select>
        <input
          type="text"
          placeholder={`Search by ${searchBy}`}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>
      {loading ? (
        <div className="loader-container">
          <Oval
            height={40}
            width={40}
            color="#007BFF"
            visible={true}
            ariaLabel='oval-loading'
            secondaryColor="#007BFF"
            strokeWidth={2}
            strokeWidthSecondary={2}
          />
        </div>
      ) : (
        <ul>
          {breweries.map(brewery => (
            <li key={brewery.id}>
              <Link to={`/brewery/${brewery.id}`}>
                {brewery.name} - {brewery.city}, {brewery.state}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default BreweryList;
