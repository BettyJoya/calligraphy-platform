import { createBrowserRouter, createRoutesFromElements, Route } from 'react-router-dom';
import App from './App.tsx';
import { Home } from './pages/home/Home.tsx';
import { Error } from './pages/error/Error.tsx';
import { CopyBook, Writing, Community, Personal } from './pages/home/pages/index.ts';
import { PersonalContent } from './pages/home/pages/personal/Personal.tsx';

export const router = createBrowserRouter(
  createRoutesFromElements(
    <Route element={<App />} path="/" errorElement={<Error />}>
      <Route caseSensitive element={<Home />} path="home">
        <Route caseSensitive element={<CopyBook />} path="copyBook" />
        <Route caseSensitive element={<Writing />} path="writing" />
        <Route caseSensitive element={<Community />} path="community"></Route>
        <Route caseSensitive element={<Personal />} path="personal">
          <Route caseSensitive path=":kind" element={<PersonalContent />} />
        </Route>
      </Route>
    </Route>
  )
);
