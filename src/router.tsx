import { createBrowserRouter, createRoutesFromElements, Route } from 'react-router-dom';
import App from './App.tsx';
import { Home } from './pages/home/Home.tsx';
import { Community } from './pages/home/pages/community/Community.tsx';
import { Personal } from './pages/home/pages/personal/Personal.tsx';
import { CopyBook } from './pages/home/pages/copyBook/CopyBook.tsx';
import { Copy } from './pages/home/pages/copy/Copy.tsx';

export const router = createBrowserRouter(
  createRoutesFromElements(
    <Route element={<App />} path="/">
      <Route element={<Home />} path="home">
        <Route element={<CopyBook />} path="copyBook" />
        <Route element={<Copy />} path="copy" />
        <Route element={<Community />} path="community"></Route>
        <Route element={<Personal />} path="personal"></Route>
      </Route>
    </Route>
  )
);
