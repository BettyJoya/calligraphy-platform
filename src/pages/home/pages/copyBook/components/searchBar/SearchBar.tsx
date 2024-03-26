import { FC } from 'react';
import './searchBar.css';

const SearchBar: FC = () => {
  return (
    <div className="search-bar">
      <input className="search-input" type="text" placeholder="可搜索帖名、书法家、关键字" />
    </div>
  );
};

export { SearchBar };
