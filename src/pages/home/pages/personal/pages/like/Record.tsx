import { fetchData } from '@myCommon/fetchData.ts';
import { FC, useEffect, useState } from 'react';
import type { CopyBookInfo } from '../../../copyBook/types.ts';
import { BookCard } from '../../../copyBook/components/bookCard/BookCard.tsx';
import { useNavigate } from 'react-router-dom';
import { selectLogin } from '@myStore/slices/loginSlice.ts';
import { useSelector } from 'react-redux';
import { useLoginState } from '@myHooks/useLoginState.ts';

const Record: FC = () => {
  useLoginState();
  const loginState = useSelector(selectLogin);
  const navigate = useNavigate();
  const [historyList, setHistoryList] = useState<CopyBookInfo[]>([]);
  useEffect(() => {
    const historyFetch = async () => {
      try {
        const res = await fetchData('GET', {
          url: 'http://localhost:3001/api/users/self-history'
        });
        if (res.code === 200) {
          const data = res.data as { copybooks: CopyBookInfo[] };
          setHistoryList(data.copybooks);
        } else {
          console.log(res);
        }
      } catch (error) {
        console.log(error);
      }
    };
    if (loginState === 'login') {
      historyFetch();
    }
  }, [loginState]);

  const handleBookCardClick = (id: string) => {
    return () => {
      navigate(`/home/copyBook/${id}`);
    };
  };

  return (
    <>
      <div className="copy-book-content">
        <div className="copy-book-card-list">
          {historyList.length > 0 ? (
            historyList.map(book => <BookCard key={book.id} info={book} onBookClick={handleBookCardClick(book.id)} />)
          ) : (
            <div>暂无数据</div>
          )}
        </div>
      </div>
    </>
  );
};

export { Record };
