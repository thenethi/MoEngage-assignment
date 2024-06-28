import  { useState } from 'react';
import { Redirect } from 'react-router-dom';
import Cookie from 'js-cookie';
import { Oval } from 'react-loader-spinner';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [redirectToHome, setRedirectToHome] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    const response = await fetch('https://moengage-assignment.onrender.com/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    const data = await response.json();
    if (response.status === 200) {
      Cookie.set("jwt_token", data.token, { expires: 30 });
      Cookie.set("user_id", data.user.id, { expires: 30 });
      setRedirectToHome(true);
    } else {
      setError(data.message || 'An error occurred during login');
      setLoading(false);
    }
  };

  if (redirectToHome || Cookie.get("jwt_token")) {
    return <Redirect to="/" />;
  }

  return (
    <form onSubmit={handleSubmit}>
      <h1>Login!</h1>
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
          'Login'
        )}
      </button>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <a href='/register'>Not Registered With Us?</a>
    </form>
  );
};

export default Login;
