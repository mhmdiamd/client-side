import { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../useContext/authContext';
import './navbar.css';

const Navbar = () => {
  const { user } = useContext(AuthContext);
  return (
    <div className="navbar">
      <div className="navContainer">
        <Link to="/">
          <span
            className="logo"
            style={{
              color: 'white',
              textDecoration: 'none',
            }}
          >
            Ngendong Kuy!
          </span>
        </Link>
        {user ? (
          user.username
        ) : (
          <div className="navItems">
            <button className="navButton">Register</button>
            <button className="navButton">Login</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Navbar;
