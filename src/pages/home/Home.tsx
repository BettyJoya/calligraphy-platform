import { FC } from 'react';
import { Navigation } from './components/Navigation/Navigation.tsx';
import './home.css';
import { Outlet } from 'react-router-dom';

const Home: FC = () => {
  return (
    <div className="home">
      <main className="home-main">
        <Outlet></Outlet>
      </main>
      <Navigation />
    </div>
  );
};

export { Home };
