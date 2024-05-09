import { FC, useCallback, useEffect, useState } from 'react';
import './collectingDetail.css';
import { useNavigate, useParams } from 'react-router-dom';
import { fetchData } from '@myCommon/fetchData.ts';
import { Fab, FormControl, InputLabel, MenuItem, Select, SelectChangeEvent } from '@mui/material';
import MessageSnackbar from '@myComponents/message/Message.tsx';

interface LetterInfo {
  id: string;
  title: string;
  font_type: string;
  source: string;
  pic: string;
}

interface filterLetterInfo extends LetterInfo {
  isSelected: boolean;
}

const CollectingDetail: FC = () => {
  const navigate = useNavigate();
  const param = useParams();
  const keys = param.id?.split('');
  const [collectArray, setCollectArray] = useState<
    {
      id: string;
      index: number;
    }[]
  >([]);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [letterList, setLetterList] = useState<LetterInfo[]>([]);
  const [filterLetterList, setFilterLetterList] = useState<filterLetterInfo[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  // const [hasMore, setHasMore] = useState<boolean>(true);
  const [page, setPage] = useState<number>(1);
  const [pageSize] = useState<number>(50);
  // const [fetching, setFetching] = useState<boolean>(false);
  const [fontType, setFontType] = useState<string>('1');
  const [currentKey, setCurrentKey] = useState<string>(keys === undefined ? '' : keys[0]);
  const [messageOpen, setMessageOpen] = useState<boolean>(false);
  const [message, setMessage] = useState<string>('');
  const [messageType, setMessageType] = useState<'success' | 'error' | 'info' | 'warning'>('success');

  const handleSelectChange = (event: SelectChangeEvent) => {
    const value = event.target.value;
    if (value) {
      setFontType(value);
      setPage(1);
      getLetterList(event.target.value, page);
    }
  };

  const handleLetterCardClick = (id: string) => {
    return () => {
      console.log(filterLetterList);
      // 加边框颜色
      // 设置isSelected为true
      const updatedList = filterLetterList.map(letter => {
        if (letter.id === id) {
          if (letter.isSelected) {
            return {
              ...letter,
              isSelected: false
            };
          } else {
            return {
              ...letter,
              isSelected: true
            };
          }
        } else {
          return {
            ...letter,
            isSelected: false
          };
        }
        return letter;
      });
      // 删除 collectArray 中 index 为 currentIndex 的元素
      setCollectArray(prevArray => {
        return prevArray.filter(item => item.index !== currentIndex);
      });
      // 遍历 updatedList 找到isSelected为true的元素，将其id和currentIndex添加到collectArray中
      updatedList.forEach(letter => {
        if (letter && letter.isSelected) {
          setCollectArray(prevArray => {
            return [
              ...prevArray,
              {
                id: letter.id,
                index: currentIndex
              }
            ];
          });
        }
      });
      console.log(123, updatedList);
      setFilterLetterList(updatedList);
      console.log(filterLetterList);
    };
  };

  const getLetterList = useCallback(
    async (font_type: string, page: number) => {
      try {
        const url = `http://localhost:3001/api/letters/list`;

        // setFetching(true);
        const res = await fetchData(
          'POST',
          {
            url: url
          },
          {
            page,
            pageSize,
            fontType: font_type,
            letter: currentKey,
            search: ''
          }
        );

        if (res.code === 200) {
          const data = res.data as { letters: LetterInfo[]; totalPages: number };
          if (page !== 1) {
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
              const newList = data.letters.map(letter => {
                return {
                  ...letter,
                  isSelected: false
                };
              });
              return [...prevList, ...newList];
            });
          } else {
            setLetterList(data.letters);
            const newList = data.letters.map(letter => {
              return {
                ...letter,
                isSelected: false
              };
            });
            setFilterLetterList(newList);
          }
          // 如果data.letters的第一个元素的id和letterList的第一个元素的id相同，则说明数据重复，不增加page
          if (letterList.length > 0 && letterList[0].id === data.letters[0].id) {
            return;
          }
          // setPage(prevPage => prevPage + 1);
          // if (page >= data.totalPages) {
          //   setHasMore(false);
          // }
          // console.log(page);
        }
      } catch (err) {
        console.log(err);
      } finally {
        // setFetching(false);
        setLoading(false);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [currentKey, pageSize]
  );

  useEffect(() => {
    getLetterList(fontType, page);
  }, [fontType, getLetterList, page]);

  const changeKey = (key: string, index: number) => {
    return () => {
      if (currentKey !== key) {
        setCurrentKey(key);
        setCurrentIndex(index);
      }
    };
  };

  const fetchAddCollect = async () => {
    try {
      const url = `http://localhost:3001/api/collects/add`;
      const res = await fetchData(
        'POST',
        {
          url: url
        },
        {
          title: param.id,
          letterids: collectArray.map(item => item.id)
        }
      );
      if (res.code === 200) {
        setMessage('添加集字成功');
        setMessageType('success');
        setMessageOpen(true);
        const data = res.data as { collect_id: string };
        navigate(`/home/collecting/wode/${data.collect_id}`);
      }
    } catch (err) {
      console.log(err);
      setMessage('添加集字失败');
      setMessageType('error');
      setMessageOpen(true);
    }
  };
  const handleGenerate = () => {
    if (collectArray.length !== keys?.length) {
      setMessage('未完成选择');
      setMessageType('error');
      setMessageOpen(true);
      return;
    }
    console.log(collectArray);
    fetchAddCollect();
  };

  return (
    <div className="collecting-detail">
      <div className="collecting-header">
        <div className="collecting-nav-bar">
          {keys?.map((key, index) => {
            return (
              <div
                key={key}
                className={currentKey === key ? 'nav-item active' : 'nav-item'}
                onClick={changeKey(key, index)}
              >
                {key}
              </div>
            );
          })}
        </div>
        <FormControl className="select-form-control" sx={{ m: 1, minWidth: 80 }} size="small">
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
      {loading ? (
        <div>loading...</div>
      ) : (
        <div className="collecting-main">
          <div className="writing-letter-list">
            {filterLetterList.length > 0 ? (
              filterLetterList.map(letter => (
                <LetterCard
                  key={letter.id}
                  info={letter}
                  isSelected={letter.isSelected}
                  onLetterClick={handleLetterCardClick(letter.id)}
                  collectArray={collectArray}
                  setFilterLetterList={setFilterLetterList}
                />
              ))
            ) : (
              <div>暂无数据</div>
            )}
            <i></i>
            <i></i>
            <i></i>
            <i></i>
            <i></i>
            <i></i>
            <i></i>
            <i></i>
          </div>
        </div>
      )}
      <Fab className="generate-btn" variant="extended" onClick={handleGenerate}>
        生成
      </Fab>
      <MessageSnackbar
        vertical="top"
        horizontal="center"
        open={messageOpen}
        message={message}
        type={messageType}
        setOpen={setMessageOpen}
      />
    </div>
  );
};

interface LetterCardProps {
  info: LetterInfo;
  isSelected: boolean;
  collectArray: {
    id: string;
    index: number;
  }[];
  setFilterLetterList: (value: React.SetStateAction<filterLetterInfo[]>) => void;
  onLetterClick?: () => void;
}

const LetterCard: FC<LetterCardProps> = ({ info, isSelected, onLetterClick, collectArray, setFilterLetterList }) => {
  useEffect(() => {
    // 判断数组中是否有当前元素的id，如果有，则设置isSelected为true
    const isExist = collectArray.find(item => item.id === info.id);
    if (isExist) {
      setFilterLetterList(prevList => {
        return prevList.map(letter => {
          if (letter.id === info.id) {
            return {
              ...letter,
              isSelected: true
            };
          }
          return letter;
        });
      });
    }
  });
  return (
    <div
      className="letter-card"
      onClick={onLetterClick}
      style={isSelected ? { border: '2px solid var(--active-background-color)' } : {}}
    >
      <div className="card-img">
        <img src={`data:image/png;base64,${info.pic}`} alt="" />
      </div>
      <div className="card-text">
        <h3>{isSelected ? '已选择' : '未选择'}</h3>
      </div>
    </div>
  );
};

export { CollectingDetail };
