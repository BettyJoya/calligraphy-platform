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
            <item.icon className="nav-icon" />
            <span>{item.title}</span>
          </div>
        ) : (
          <div key={item.key} className="nav-item" onClick={handleNavigate(item.key)}>
            <item.icon className="nav-icon" />
            <span>{item.title}</span>
          </div>
        )
      )}
    </nav>
  );
};

export { Navigation };
