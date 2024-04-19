import { FC } from 'react';
import { UserWorkCard } from '../../components/userWorkCard/UserWorkCard.tsx';
import { useNavigate } from 'react-router-dom';

const Recommend: FC = () => {
  const navigate = useNavigate();

  const workInfo = {
    id: '1',
    userAvatar: 'https://avatars.githubusercontent.com/u/52642460?v=4',
    userName: 'user',
    title: 'title',
    mainPic: 'https://avatars.githubusercontent.com/u/52642460?v=4',
    isLike: true,
    likeCount: 10
  };

  const handleCardClick = (id: string) => {
    return () => {
      navigate(`/home/community/${id}`);
    };
  };
  return (
    <div className="recommend">
      <div className="recommend-user-work-list">
        <UserWorkCard workInfo={workInfo} onCardClick={handleCardClick(workInfo.id)} />
      </div>
    </div>
  );
};

export { Recommend };
