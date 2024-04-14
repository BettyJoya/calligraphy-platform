import { FC, useEffect, useState } from 'react';
import './copyBook.css';
import { Outlet, useNavigate, useParams } from 'react-router-dom';
import { fetchData } from '@myCommon/fetchData.ts';
import { CopyBookInfo } from './types.ts';
import { BookCard } from './components/bookCard/BookCard.tsx';

const CopyBook: FC = () => {
  const navigate = useNavigate();
  const id = useParams().id;
  const [bookList, setBookList] = useState<CopyBookInfo[]>([]);
  const [filterBookList, setFilterBookList] = useState<CopyBookInfo[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  // let bookListData: CopyBookInfo[] = [];
  const getBookList = async () => {
    try {
      const res = await fetchData('GET', {
        url: 'http://localhost:3001/api/copybook/list'
      });

      if (res.code === 200) {
        const data = res.data as { copybooks: CopyBookInfo[] };
        setBookList(data.copybooks);
        setFilterBookList(data.copybooks);
        // bookListData = data.copybooks;
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

  const addHistoryFetch = async (id: string) => {
    try {
      const res = await fetchData(
        'POST',
        {
          url: `http://localhost:3001/api/copybook/addHistory`,
          headers: {
            'Content-Type': 'application/json'
          }
        },
        {
          copybookId: id
        }
      );
      if (res.code !== 200) {
        throw new Error(res.data as string);
      }
    } catch (error) {
      if (error instanceof Error) {
        console.log(error.message);
      }
    }
  };
  const handleBookCardClick = (id: string) => {
    return () => {
      addHistoryFetch(id);
      navigate(`/home/copyBook/${id}`);
    };
  };

  const handleFilter = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const newBookList = bookList.filter(book => book.name.includes(value) || book.author.includes(value));
    setFilterBookList(newBookList);
  };

  if (loading) {
    return <div>Loading...</div>;
  }
  return !id ? (
    <div className="copy-book-content">
      <div className="search-bar">
        <input className="search-input" type="text" placeholder="可搜索帖名、书法家" onChange={handleFilter} />
      </div>
      <div className="copy-book-card-list">
        {filterBookList.length > 0 ? (
          filterBookList.map(book => <BookCard key={book.id} info={book} onBookClick={handleBookCardClick(book.id)} />)
        ) : (
          <div>暂无数据</div>
        )}
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

export { CopyBook };
