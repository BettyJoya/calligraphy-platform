import { FC, useState, useEffect } from 'react';
import './wode.css';
import { CollectingCardInfo } from '../../types.ts';
import { fetchData } from '@myCommon/fetchData.ts';
import { useNavigate } from 'react-router-dom';
import { useLoginState } from '@myHooks/useLoginState.ts';
import { useSelector } from 'react-redux';
import { selectLogin } from '@myStore/slices/loginSlice.ts';

const Wode: FC = () => {
  useLoginState();
  const loginState = useSelector(selectLogin);
  const navigate = useNavigate();
  const [collectingList, setCollectingList] = useState<CollectingCardInfo[]>([]);
  useEffect(() => {
    const fetchCollectingList = async () => {
      try {
        const res = await fetchData<{ collects: CollectingCardInfo[] }>('GET', {
          url: 'http://localhost:3001/api/collects/list'
        });
        if (res.code === 200) {
          const data = res.data;
          setCollectingList(data.collects as CollectingCardInfo[]);
        } else {
          throw new Error(res.data as string);
        }
      } catch (error) {
        if (error instanceof Error) {
          console.log(error.message);
        }
      }
    };
    if (loginState === 'login') {
      fetchCollectingList();
    }
  }, [loginState]);

  const handleClickCard = (id: string) => {
    return () => {
      navigate(`/home/collecting/wode/${id}`);
    };
  };
  return (
    <div className="wode">
      {collectingList.length === 0 ? (
        <div>暂无集字</div>
      ) : (
        <div className="collecting-card-list">
          {collectingList.map(item => (
            <CollectingCard key={item.id} info={item} onCollectingCardClick={handleClickCard(item.id)} />
          ))}
          <i></i>
          <i></i>
          <i></i>
          <i></i>
          <i></i>
        </div>
      )}
    </div>
  );
};
interface CollectingCardProps {
  info: CollectingCardInfo;
  onCollectingCardClick?: () => void;
}

const CollectingCard: FC<CollectingCardProps> = ({ info, onCollectingCardClick }) => {
  // 将info.letters按info.title排序
  info.letters.sort((a, b) => {
    return a.title.localeCompare(b.title);
  });
  console.log(info.letters);

  return (
    <div className="collecting-card" onClick={onCollectingCardClick}>
      <div className="card-img">
        {info.title
          .split('')
          .slice(0, 4)
          .map(item => {
            const letter = info.letters.find(letter => letter.title === item);
            return <img key={letter?.title} src={`data:image/png;base64,${letter?.pic}`} alt={letter?.title} />;
          })}
      </div>
      <div className="card-text">
        <h3>{info.title}</h3>
      </div>
    </div>
  );
};
export { Wode };
