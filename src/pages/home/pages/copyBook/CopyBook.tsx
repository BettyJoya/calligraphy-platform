import { FC, useCallback, useEffect, useState } from 'react';
import './copyBook.css';
import { Outlet, useNavigate, useParams } from 'react-router-dom';
import { fetchData } from '@myCommon/fetchData.ts';
import { CopyBookInfo } from './types.ts';
import { BookCard } from './components/bookCard/BookCard.tsx';
import { IconButton } from '@mui/material';
import { MdOutlineSearch } from 'react-icons/md';

const CopyBook: FC = () => {
  const navigate = useNavigate();
  const id = useParams().id;
  const [searchText, setSearchText] = useState<string>('');
  const [bookList, setBookList] = useState<CopyBookInfo[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  // let bookListData: CopyBookInfo[] = [];
  const getBookList = useCallback(async (search: string) => {
    try {
      console.log(searchText);
      const res = await fetchData(
        'POST',
        {
          url: 'http://localhost:3001/api/copybook/list'
        },
        {
          search: search
        }
      );

      if (res.code === 200) {
        const data = res.data as { copybooks: CopyBookInfo[] };
        setBookList(data.copybooks);
        // bookListData = data.copybooks;
      }
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  useEffect(() => {
    // fetch book list
    getBookList('');
  }, [getBookList]);

  const handleBookCardClick = (id: string) => {
    return () => {
      // addHistoryFetch(id);
      navigate(`/home/copyBook/${id}`);
    };
  };

  const handleFilter = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchText(value);
  };

  const handleSearch = () => {
    console.log(searchText);

    setLoading(true);
    getBookList(searchText);
  };

  return !id ? (
    <div className="copy-book-content">
      <div className="search-bar">
        <input
          className="search-input"
          type="text"
          value={searchText}
          placeholder="可搜索帖名、书法家"
          onChange={handleFilter}
        />
        <IconButton aria-label="search" onClick={handleSearch}>
          <MdOutlineSearch />
        </IconButton>
      </div>
      {loading ? (
        <div>loading...</div>
      ) : (
        <div className="copy-book-card-list">
          {bookList.length > 0 ? (
            bookList.map(book => <BookCard key={book.id} info={book} onBookClick={handleBookCardClick(book.id)} />)
          ) : (
            <div>暂无数据</div>
          )}
          <i></i>
          <i></i>
          <i></i>
          <i></i>
          <i></i>
        </div>
      )}
    </div>
  ) : (
    <Outlet />
  );
};

export { CopyBook };
