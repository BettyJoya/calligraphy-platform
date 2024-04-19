import { FC } from 'react';
import { MdOutlineStar, MdOutlineStarBorder } from 'react-icons/md';
import type { WorkInfo } from '../../types.ts';
import './userWorkCard.css';

interface UserWorkCardProps {
  workInfo: WorkInfo;
  onCardClick: () => void;
}

const UserWorkCard: FC<UserWorkCardProps> = (props: UserWorkCardProps) => {
  const { workInfo, onCardClick } = props;
  return (
    <div className="user-work-card" onClick={onCardClick}>
      <img className="work-img" src={workInfo.mainPic}></img>
      <p className="title">{workInfo.title}</p>
      <div className="info">
        <div className="user">
          <img className="user-img" src={workInfo.userAvatar}></img>
          <div className="name">{workInfo.userName}</div>
        </div>
        <div className="like">
          {workInfo.isLike ? <MdOutlineStar /> : <MdOutlineStarBorder />}
          <div>{workInfo.likeCount}</div>
        </div>
      </div>
    </div>
  );
};

export { UserWorkCard };
