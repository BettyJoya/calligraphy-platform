import { createBrowserRouter, createRoutesFromElements, Route } from 'react-router-dom';
import App from './App.tsx';
import { Home } from './pages/home/Home.tsx';
import { Test } from './pages/home/pages/test/Test.tsx';
import { Personal } from './pages/personal/Personal.tsx';
import { SearchChar } from './pages/searchChar/SearchChar.tsx';

export const router = createBrowserRouter(
  createRoutesFromElements(
    <Route element={<App />} path="/">
      <Route element={<Home />} path="home">
        <Route element={<Test />} path=":key" />
      </Route>
      <Route element={<Personal />} path="personal"></Route>
      <Route element={<SearchChar />} path="SearchChar"></Route>
    </Route>
  )
);
