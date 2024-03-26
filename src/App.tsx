import { useEffect } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';

function App() {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (location.pathname === '/') {
      navigate('/home/copyBook');
    }
  });

  return (
    <>
      <Outlet></Outlet>
    </>
  );
}

export default App;
