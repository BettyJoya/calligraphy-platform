import { FC, useEffect, useState } from 'react';
import './writing.css';
import { fetchData } from '@myCommon/fetchData.ts';

interface LetterInfo {
  id: string;
  title: string;
  source: string;
  pic: string;
}

const Writing: FC = () => {
  const [letterList, setLetterList] = useState<LetterInfo[]>([]);
  const [filterLetterList, setFilterLetterList] = useState<LetterInfo[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [page, setPage] = useState<number>(1);
  const [pageSize] = useState<number>(50);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [fetching, setFetching] = useState<boolean>(false);

  useEffect(() => {
    const getLetterList = async () => {
      try {
        setFetching(true);
        const res = await fetchData('GET', {
          url: `http://localhost:3001/api/letters/list?page=${page}&pageSize=${pageSize}`
        });

        if (res.code === 200) {
          const data = res.data as { letters: LetterInfo[]; totalPages: number };
          setLetterList(prevList => {
            // 如果prevList第一个元素的id和data.letters第一个元素的id相同，则说明数据重复，不添加
            if (prevList.length > 0 && prevList[0].id === data.letters[0].id) {
              return prevList;
            }
            return [...prevList, ...data.letters];
          });
          setFilterLetterList(prevList => {
            // 如果prevList第一个元素的id和data.letters第一个元素的id相同，则说明数据重复，不添加
            if (prevList.length > 0 && prevList[0].id === data.letters[0].id) {
              return prevList;
            }
            return [...prevList, ...data.letters];
          });
          // 如果data.letters的第一个元素的id和letterList的第一个元素的id相同，则说明数据重复，不增加page
          if (letterList.length > 0 && letterList[0].id === data.letters[0].id) {
            return;
          }
          setPage(prevPage => prevPage + 1);
          if (page >= data.totalPages) {
            setHasMore(false);
          }
          console.log(page);
        }
      } catch (err) {
        console.log(err);
      } finally {
        setFetching(false);
        setLoading(false);
      }
    };
    console.log(loading, fetching);

    if (loading && !fetching) {
      getLetterList();
    }
    const handleScroll = () => {
      console.log(
        window.innerHeight + document.documentElement.scrollTop,
        document.documentElement.offsetHeight,
        hasMore,
        loading,
        fetching
      );

      if (
        window.innerHeight + document.documentElement.scrollTop === document.documentElement.offsetHeight &&
        hasMore &&
        !loading && // 添加判断，避免重复加载
        !fetching // 添加判断，避免重复加载
      ) {
        setLoading(true);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [loading, fetching, page, pageSize, letterList, hasMore]); // 当 loading 或 fetching 状态改变时执行

  // useEffect(() => {
  //   const handleScroll = () => {
  //     console.log(
  //       window.innerHeight + document.documentElement.scrollTop,
  //       document.documentElement.offsetHeight,
  //       hasMore,
  //       loading,
  //       fetching
  //     );

  //     if (
  //       window.innerHeight + document.documentElement.scrollTop === document.documentElement.offsetHeight &&
  //       hasMore &&
  //       !loading && // 添加判断，避免重复加载
  //       !fetching // 添加判断，避免重复加载
  //     ) {
  //       setLoading(true);
  //     }
  //   };

  //   window.addEventListener('scroll', handleScroll);
  //   return () => {
  //     window.removeEventListener('scroll', handleScroll);
  //   };
  // }, [loading, fetching, hasMore]); // 依赖项中添加 hasMore

  const handleLetterCardClick = (id: string) => () => {
    console.log(id);
  };

  const handleFilter = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value) {
      const filterList = letterList.filter(item => item.title.includes(value));
      setFilterLetterList(filterList);
    } else {
      setFilterLetterList(letterList);
    }
  };

  // 滚动加载数据

  if (loading) {
    return <div>loading...</div>;
  }
  return (
    <div className="writing">
      <div className="search-bar">
        <input className="search-input" type="text" placeholder="输入您想写的字" onChange={handleFilter} />
      </div>
      <div className="writing-letter-list">
        {filterLetterList.length > 0 ? (
          filterLetterList.map(letter => (
            <LetterCard key={letter.id} info={letter} onLetterClick={handleLetterCardClick(letter.id)} />
          ))
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
  );
};

interface LetterCardProps {
  info: LetterInfo;
  onLetterClick?: () => void;
}

const LetterCard: FC<LetterCardProps> = ({ info, onLetterClick }) => {
  return (
    <div className="letter-card" onClick={onLetterClick}>
      <div className="card-img">
        <img src={`data:image/png;base64,${info.pic}`} alt="" />
      </div>
      <div className="card-text">
        <h3>{info.title}</h3>
      </div>
    </div>
  );
};

export { Writing };
