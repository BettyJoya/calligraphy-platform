import { useNavigate, useLocation } from 'react-router-dom';
import { NavList, NavListKeys } from './types.ts';
import './navigation.css';

const Navigation = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleNavigate = (pageRoute: NavListKeys) => {
    return () => {
      if (location.pathname !== pageRoute) {
        navigate(`/${pageRoute}`);
      }
    };
  };
  return (
    <nav className="nav-bar">
      <div className="nav-logo">
        <h1>logo</h1>
      </div>
      {NavList.map(item =>
        item.key === 'more' ? (
          <div key={item.key} className="nav-more">
            <div className="nav-content">
              <item.icon className="nav-icon" />
              <span className="nav-title">{item.title}</span>
            </div>
          </div>
        ) : (
          <div key={item.key} className="nav-item" onClick={handleNavigate(item.key)}>
            <div className="nav-content">
              <item.icon className="nav-icon" />
              <span className="nav-title">{item.title}</span>
            </div>
          </div>
        )
      )}
    </nav>
  );
};

export { Navigation };
