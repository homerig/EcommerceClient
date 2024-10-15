import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faShoppingCart, faUser, faCog } from '@fortawesome/free-solid-svg-icons';
import logo from '../assets/LogoMatecito.png';
import './css/Navigation.css'; 

const Navigation = () => {
  return (
    <nav className="navbar">
      <div className="navbar-left">
        <Link to="/" className="logo-link">
          <img src={logo} alt="Matecito Logo" className="logo" />
        </Link>
      </div>
      <ul className="navbar-links">
        <li>
          <Link to="/">Home</Link>
        </li>
        <li>
          <Link to="/Products">Products</Link>
        </li>
        <li>
          <Link to="/Orders">Orders</Link>
        </li>
        <li>
          <Link to="/ViewUsers">Users</Link>
        </li>
      </ul>
      <div className="navbar-icons">
        <Link to="/search">
          <FontAwesomeIcon icon={faSearch} className="icon" />
        </Link>
        <Link to="/ViewCart">
          <FontAwesomeIcon icon={faShoppingCart} className="icon" />
        </Link>
        <Link to="/Login">
          <FontAwesomeIcon icon={faUser} className="icon" />
        </Link>
        <Link to="/adminViews/ProductsAdmin">
          <FontAwesomeIcon icon={faCog} className="icon" />
        </Link>
      </div>
    </nav>
  );
};

export default Navigation;