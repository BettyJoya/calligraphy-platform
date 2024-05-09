import { FC } from 'react';
import { MdFavorite, MdFavoriteBorder, MdOutlineStar, MdOutlineStarBorder } from 'react-icons/md';
import type { ArticleInfo } from '../../types.ts';
import './userWorkCard.css';

interface UserWorkCardProps {
  articleInfo: ArticleInfo;
  onCardClick: () => void;
}

const UserWorkCard: FC<UserWorkCardProps> = (props: UserWorkCardProps) => {
  const { articleInfo, onCardClick } = props;
  return (
    <div className="user-work-card" onClick={onCardClick}>
      <img className="work-img" src={`data:image/png;base64,${articleInfo.user_pic}`}></img>
      <p className="title">{articleInfo.title}</p>
      <div className="info">
        <div className="user">
          <img className="user-img" src={`data:image/png;base64,${articleInfo.user_avatar}`}></img>
          <div className="name">{articleInfo.user_name}</div>
        </div>
        <div className="operation">
          <div className="like">
            {articleInfo.is_like ? <MdFavorite /> : <MdFavoriteBorder />}
            <div>{articleInfo.likes_count}</div>
          </div>
          <div className="like">
            {articleInfo.is_collect ? <MdOutlineStar /> : <MdOutlineStarBorder />}
            <div>{articleInfo.collects_count}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export { UserWorkCard };
