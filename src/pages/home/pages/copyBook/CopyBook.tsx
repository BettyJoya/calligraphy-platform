import { FC } from 'react';
import './copyBook.css';
import { SearchBar } from './components/searchBar/SearchBar.tsx';
import { BookCard } from './components/bookCard/BookCard.tsx';

const CopyBook: FC = () => {
  return (
    <div className="copy-book-content">
      <SearchBar />
      <div className="copy-book-card-list">
        <BookCard />
        <BookCard />
        <BookCard />
        <BookCard />
        <BookCard />
        <BookCard />
        <BookCard />
        <BookCard />
        <BookCard />
        <BookCard />
      </div>
    </div>
  );
};

export { CopyBook };
