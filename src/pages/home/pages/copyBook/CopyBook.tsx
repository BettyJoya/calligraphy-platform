import { FC, useEffect, useState } from 'react';
import './copyBook.css';
import { SearchBar } from './components/searchBar/SearchBar.tsx';
import { Outlet, useNavigate, useParams } from 'react-router-dom';
import { fetchData } from '@myCommon/fetchData.ts';
import { CopyBookInfo } from './types.ts';

const CopyBook: FC = () => {
  const navigate = useNavigate();
  const id = useParams().id;
  const [bookList, setBookList] = useState<CopyBookInfo[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const getBookList = async () => {
    console.log('123123');

    try {
      const res = await fetchData('GET', {
        url: 'http://localhost:3001/api/copybook/list'
      });
      console.log(res);

      if (res.code === 200) {
        const data = res.data as { copybooks: CopyBookInfo[] };
        setBookList(data.copybooks);
      }
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    // fetch book list
    getBookList();
  }, []);
  const handleBookCardClick = () => {
    navigate('/home/copyBook/1');
  };
  if (loading) {
    return <div>Loading...</div>;
  }
  return !id ? (
    <div className="copy-book-content">
      <SearchBar />
      <div className="copy-book-card-list">
        {bookList.map(book => {
          return <BookCard key={book.id} info={book} onBookClick={handleBookCardClick} />;
        })}
        <i></i>
        <i></i>
        <i></i>
        <i></i>
        <i></i>
      </div>
    </div>
  ) : (
    <Outlet />
  );
};

interface BookCardProps {
  info: CopyBookInfo;
  onBookClick?: () => void;
}

const BookCard: FC<BookCardProps> = ({ info, onBookClick }) => {
  return (
    <div className="book-card" onClick={onBookClick}>
      <div className="card-img">
        <img src={`data:image/png;base64,${info.mainPic}`} alt="" />
      </div>
      <div className="card-text">
        <h3>{info.name}</h3>
        <p>{info.author}</p>
      </div>
    </div>
  );
};

export { CopyBook };
