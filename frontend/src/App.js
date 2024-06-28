import { Switch, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import Register from './components/auth/Register';
import Login from './components/auth/Login';
import BreweryDetail from './components/brewery/BreweryDetail';
import ProtectedRoute from './pages/ProtectedRoute';
import './styles.css';

const App = () => (
    <Switch>
      <ProtectedRoute exact path="/" component={HomePage} />
      <Route exact path="/register" component={Register} />
      <Route exact path="/login" component={Login} />
      <ProtectedRoute exact path="/brewery/:id" component={BreweryDetail} />
    </Switch>
);

export default App;
