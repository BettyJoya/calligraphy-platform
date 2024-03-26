import { FC } from 'react';
import './navigation.css';
import { useNavigate, useLocation } from 'react-router-dom';
import { navList } from './types.ts';

const Navigation: FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const handleChangePage = (route: string) => {
    return () => {
      if (location.pathname !== `/home/${route}`) {
        navigate(`/home/${route}`);
      }
    };
  };
  return (
    <nav className="nav">
      <div className="logo">
        <h2>Logo</h2>
      </div>
      <ul className="nav-list">
        {navList.map(item => {
          return (
            <li
              className={location.pathname.includes(`/home/${item.key}`) ? 'nav-item active' : 'nav-item'}
              key={item.key}
              onClick={handleChangePage(item.key)}
            >
              <div className="nav-content">
                <span className="nav-icon">
                  <item.icon />
                </span>
                <div>{item.title}</div>
              </div>
            </li>
          );
        })}
      </ul>
    </nav>
  );
};

export { Navigation };
