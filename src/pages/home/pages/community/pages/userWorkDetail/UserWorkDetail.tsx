import { FC, useState } from 'react';
import { MdArrowBack, MdFavoriteBorder, MdOutlineIosShare, MdOutlineStar, MdOutlineStarBorder } from 'react-icons/md';
// import { useParams } from 'react-router-dom';
import { WorkInfoDetail } from '../../types.ts';
import { Button } from '@mui/material';
import './userWorkDetail.css';

const UserWorkDetail: FC = () => {
  // const param = useParams();
  // const id = param.id;
  const [userWorkDetail] = useState<WorkInfoDetail | undefined>({
    id: '1',
    userAvatar: 'https://avatars.githubusercontent.com/u/52642460?v=4',
    userName: 'user',
    title: 'title',
    mainPic: 'https://avatars.githubusercontent.com/u/52642460?v=4',
    isLike: true,
    likeCount: 10,
    content: 'content',
    commentCount: 10,
    isAttention: true,
    isCollected: true,
    collectCount: 10,
    createTime: '2021-09-01'
  });
  const handleBackClick = () => {
    window.history.back();
  };

  const handleCollect = () => {
    console.log('collect');
  };

  return (
    <div className="user-work-detail">
      <div className="user-work-detail-header">
        <div className="btn" onClick={handleBackClick}>
          <MdArrowBack />
        </div>
        <div className="user">
          <div className="info">
            <img src={userWorkDetail?.userAvatar} alt="user avatar" />
            <div className="user-name">{userWorkDetail?.userName}</div>
          </div>
          <div className="attention">
            {userWorkDetail?.isAttention === true ? (
              <Button className="outlined-btn" variant="outlined">
                已关注
              </Button>
            ) : (
              <Button className="contained-btn" variant="contained">
                关注
              </Button>
            )}
          </div>
        </div>
      </div>
      <div className="operate">
        <div className="btn">
          <MdFavoriteBorder />
        </div>
        <div className="btn" onClick={handleCollect}>
          {userWorkDetail?.isCollected === true ? <MdOutlineStar /> : <MdOutlineStarBorder />}
        </div>
        <div className="btn">
          <MdOutlineIosShare />
        </div>
      </div>
    </div>
  );
};

export { UserWorkDetail };
