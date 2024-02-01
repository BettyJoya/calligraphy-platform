import { useEffect } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { Navigation } from './components/Navigation/Navigation.tsx';
import './app.css';

function App() {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (location.pathname === '/') {
      navigate('/home');
    }
  });

  return (
    <div className="container">
      <Navigation />
      <main className="content">
        <Outlet />
      </main>
    </div>
  );
}

export default App;
