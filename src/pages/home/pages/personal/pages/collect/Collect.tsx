import { fetchData } from '@myCommon/fetchData.ts';
import { FC, useEffect, useState } from 'react';
import type { CopyBookInfo } from '../../../copyBook/types';
import { BookCard } from '../../../copyBook/components/bookCard/BookCard.tsx';
import { useNavigate } from 'react-router-dom';
import { useLoginState } from '@myHooks/useLoginState.ts';
import { useSelector } from 'react-redux';
import { selectLogin } from '@myStore/slices/loginSlice.ts';

const Collect: FC = () => {
  useLoginState();
  const loginState = useSelector(selectLogin);
  const navigate = useNavigate();
  const [collectionList, setCollectionList] = useState<CopyBookInfo[]>([]);
  useEffect(() => {
    const collectionFetch = async () => {
      try {
        const res = await fetchData('GET', {
          url: 'http://localhost:3001/api/users/self-collection'
        });
        if (res.code === 200) {
          const data = res.data as { copybooks: CopyBookInfo[] };
          setCollectionList(data.copybooks);
        } else {
          console.log(res);
        }
      } catch (error) {
        console.log(error);
      }
    };
    if (loginState === 'login') {
      collectionFetch();
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
          {collectionList.length > 0 ? (
            collectionList.map(book => (
              <BookCard key={book.id} info={book} onBookClick={handleBookCardClick(book.id)} />
            ))
          ) : (
            <div>暂无数据</div>
          )}
        </div>
      </div>
    </>
  );
};

export { Collect };
