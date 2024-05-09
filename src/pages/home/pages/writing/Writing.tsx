import { FC, useEffect, useRef, useState } from 'react';
import './writing.css';
import { fetchData } from '@myCommon/fetchData.ts';
import { FormControl, IconButton, InputLabel, MenuItem, Select, SelectChangeEvent } from '@mui/material';
import { useParams, Outlet, useNavigate } from 'react-router-dom';
import { MdOutlineSearch } from 'react-icons/md';
// import { addHistoryFetch } from '@myCommon/addHistoryFetch';

interface LetterInfo {
  id: string;
  title: string;
  font_type: string;
  source: string;
  pic: string;
}

const Writing: FC = () => {
  const params = useParams();
  const navigate = useNavigate();

  const letterId = params.id?.split('=')[0] === 'letterId' ? params.id?.split('=')[1] : '';
  const copyBookId = params.id?.split('=')[0] === 'copybookId' ? params.id?.split('=')[1] : '';

  const [letterList, setLetterList] = useState<LetterInfo[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const loadingRef = useRef<HTMLDivElement>(null);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [page, setPage] = useState<number>(1);
  const [pageSize] = useState<number>(50);
  const [fetching, setFetching] = useState<boolean>(false);
  const [fontType, setFontType] = useState<string>('1');
  const [searchText, setSearchText] = useState<string>('');

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const getLetterList = async (font_type: string, page: number, letter: string) => {
    try {
      const url = `http://localhost:3001/api/letters/list`;
      const params: {
        page: number;
        pageSize: number;
        fontType: string;
        letter: string;
        copyBookId?: string;
      } = {
        page: page,
        pageSize: pageSize,
        fontType: font_type,
        letter: letter
      };
      if (copyBookId) {
        params.copyBookId = copyBookId;
      }
      console.log(params);
      setFetching(true);
      const res = await fetchData(
        'POST',
        {
          url: url
        },
        params
      );

      if (res.code === 200) {
        const data = res.data as { letters: LetterInfo[]; totalPages: number };
        if (page <= data.totalPages) {
          if (page === 1) {
            setLetterList(data.letters);
          } else {
            setLetterList([...letterList, ...data.letters]);
          }
        } else {
          setHasMore(false);
        }
      }
    } catch (err) {
      console.log(err);
    } finally {
      setFetching(false);
      setLoading(false);
    }
  };
  useEffect(() => {
    console.log(loading, fetching);
    if (loading && !fetching) {
      getLetterList(fontType, page, '');
    }
  }, [loading, fetching, page, pageSize, letterList, fontType, getLetterList]); // 当 loading 或 fetching 状态改变时执行

  useEffect(() => {
    // 如果出现在视口中，就加载数据
    const observer = new IntersectionObserver(
      entries => {
        if (entries[0].isIntersecting) {
          setPage(page + 1);
          setLoading(true);
        }
      },
      { threshold: 1 }
    );
    const currentLoadingRef = loadingRef.current;
    if (currentLoadingRef) {
      observer.observe(currentLoadingRef);
    }
    return () => {
      if (currentLoadingRef) {
        observer.unobserve(currentLoadingRef);
      }
    };
  });

  const handleLetterCardClick = (id: string) => () => {
    console.log(id);
    navigate(`/home/writing/letterId=${id}`);
    // addHistoryFetch(id);
  };

  const handleFilter = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value === '') {
      setHasMore(true);
    }
    setSearchText(value);
    setLetterList([]);
    setPage(1);
    getLetterList(fontType, page, value);
  };

  const handleSearch = () => {
    getLetterList(fontType, page, searchText);
  };

  const handleSelectChange = (event: SelectChangeEvent) => {
    const value = event.target.value;
    console.log(value);
    if (value) {
      setFontType(value);
      setPage(1);
      getLetterList(event.target.value, page, searchText);
    }
  };

  // 滚动加载数据

  return !letterId ? (
    <div className="writing">
      <div className="search-header">
        <div className="writing search-bar">
          <input className="search-input" type="text" placeholder="输入您想写的字" onChange={handleFilter} />
          <IconButton aria-label="search" onClick={handleSearch}>
            <MdOutlineSearch />
          </IconButton>
        </div>
        <FormControl className="select-form-control">
          <InputLabel id="font-type-select-label">FontType</InputLabel>
          <Select
            labelId="font-type-select-label"
            id="font-type-select"
            value={fontType}
            label="FontType"
            onChange={handleSelectChange}
          >
            <MenuItem className="font-type-menu-item" value="1">
              楷
            </MenuItem>
            <MenuItem className="font-type-menu-item" value="2">
              行
            </MenuItem>
            <MenuItem className="font-type-menu-item" value="3">
              草
            </MenuItem>
            <MenuItem className="font-type-menu-item" value="4">
              隶
            </MenuItem>
            <MenuItem className="font-type-menu-item" value="5">
              篆
            </MenuItem>
          </Select>
        </FormControl>
      </div>
      {letterList.length > 0 ? (
        <div className="writing-letter-list">
          {letterList.map(letter => (
            <LetterCard key={letter.id} info={letter} onLetterClick={handleLetterCardClick(letter.id)} />
          ))}
          <i></i>
          <i></i>
          <i></i>
          <i></i>
          <i></i>
          <i></i>
          <i></i>
          <i></i>
          <div ref={loadingRef} className="loading" style={{ display: hasMore && !fetching ? 'block' : 'none' }}>
            加载中...
          </div>
        </div>
      ) : (
        <div>暂无数据</div>
      )}
    </div>
  ) : (
    <Outlet />
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
