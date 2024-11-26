import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faShoppingCart, faUser, faCog, faHouse } from '@fortawesome/free-solid-svg-icons';
import logo from '../assets/LogoMatecito.png';
import './css/Navigation.css';

const Navigation = () => {
  const { user } = useSelector((state) => state.auth);
  const [showAdminLinks, setShowAdminLinks] = useState(false);
  const navigate = useNavigate();

  const userRole = user?.role || '';


  const toggleAdminLinks = () => {
    if (showAdminLinks) {
      setShowAdminLinks(false);
      navigate('/');
    } else {
      setShowAdminLinks(true);
      navigate('/adminViews/ProductsAdmin'); 
    }
  };

  return (
    <nav className="navbar">
      <div className="navbar-left">
        <Link to="/" className="logo-link">
          <img src={logo} alt="Matecito Logo" className="logo" />
        </Link>
      </div>
      <ul className="navbar-links">
        {showAdminLinks && userRole === 'ADMIN' ? (
          <>
          <li><Link to="/adminViews/ProductsAdmin">Productos</Link></li>
          <li><Link to="/Orders">Órdenes</Link></li>
          <li><Link to="/ViewUsers">Usuarios</Link></li>
          <li><Link to="/Categories">Categorías</Link></li>
          </>
        ) : (
          <>
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
              <Link to="/Products">Productos</Link>
            </li>
          </>
        )}
      </ul>
      <div className="navbar-icons">
        <Link to="/ViewCart">
              <FontAwesomeIcon icon={faShoppingCart} className="icon" />
            </Link>
        <Link to="/Login">
              <FontAwesomeIcon icon={faUser} className="icon" />
            </Link>
        {userRole === 'ADMIN' && (
          <button onClick={toggleAdminLinks} className="admin-toggle-button">
            <FontAwesomeIcon icon={showAdminLinks ? faHouse : faCog} className="icon" />
          </button>
        )}
      </div>
    </nav>
  );
};

export default Navigation;
