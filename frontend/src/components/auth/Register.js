import  { useState } from 'react';
import { Redirect } from 'react-router-dom';
import Cookie from 'js-cookie';
import { Oval } from 'react-loader-spinner';

const Register = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [redirectToLogin, setRedirectToLogin] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    const response = await fetch('https://moengage-assignment.onrender.com/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, email, password }),
    });
    const data = await response.json();
    if (response.status === 201) {
      setRedirectToLogin(true);
    } else {
      setError(data.message || 'An error occurred during registration');
      setLoading(false);
    }
  };

  if (redirectToLogin) {
    return <Redirect to="/login" />;
  }

  if (Cookie.get("jwt_token")) {
    return <Redirect to="/" />;
  }

  return (
    <form onSubmit={handleSubmit}>
      <h1>Register With Us!</h1>
      <input
        type="text"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        placeholder="Username"
        required
      />
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
        required
      />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
        required
      />
      <button type="submit" disabled={loading}>
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
          'Register'
        )}
      </button>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <a href='/login'>Registered With Us?</a>
    </form>
  );
};

export default Register;
