import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faShoppingCart, faUser, faCog } from '@fortawesome/free-solid-svg-icons';
import logo from '../assets/LogoMatecito.png'; // Asegúrate de que la imagen del logo está correctamente importada
import './css/Navigation.css'; // Agrega un archivo CSS para estilos

const Navigation = () => {
  return (
    <nav className="navbar">
      <div className="navbar-left">
        <a href="/" className="logo-link">
          <img src={logo} alt="Matecito Logo" className="logo" />
        </a>
      </div>
      <ul className="navbar-links">
        <li>
          <Link to="/">Home</Link>
        </li>
        <li>
          <Link to="/Products">Productos</Link>
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
