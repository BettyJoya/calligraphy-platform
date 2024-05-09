import { loginAction } from '@myStore/slices/loginSlice.ts';
import localforage from 'localforage';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';

function App() {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  const checkLoginState = async () => {
    const token = await localforage.getItem<string>('token');
    if (token) {
      dispatch(loginAction());
    }
  };
  useEffect(() => {
    checkLoginState();
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
