// import MessageSnackbar from '@myComponents/message/Message';
import { FC, useState } from 'react';
import './community.css';
import FavoriteIcon from '@mui/icons-material/Favorite';

const Community: FC = () => {
  // const navigate = useNavigate();
  const [currentKind, setCurrentKind] = useState('recommend');
  // const [messageOpen, setMessageOpen] = useState(false);
  // const [message, setMessage] = useState('');
  // const [messageType, setMessageType] = useState<'success' | 'error' | 'info' | 'warning'>('success');

  const changeKind = (kind: string) => {
    return () => {
      if (currentKind !== kind) {
        setCurrentKind(kind);
      }
    };
  };

  return (
    <div className="community">
      <div className="nav-container">
        <div className="community-nav-bar">
          <div
            className={currentKind === 'attention' ? 'nav-item active' : 'nav-item'}
            onClick={changeKind('attention')}
          >
            <FavoriteIcon /> 关注
          </div>
          <div
            className={currentKind === 'recommend' ? 'nav-item active' : 'nav-item'}
            onClick={changeKind('recommend')}
          >
            推荐
          </div>
          <div className={currentKind === 'new' ? 'nav-item active' : 'nav-item'} onClick={changeKind('new')}>
            最新
          </div>
        </div>
      </div>
      <div className="community-main">
        {currentKind === 'attention' ? (
          <div>关注</div>
        ) : currentKind === 'recommend' ? (
          <div>推荐</div>
        ) : (
          <div>最新</div>
        )}
      </div>
      {/* <MessageSnackbar
        vertical="top"
        horizontal="center"
        open={messageOpen}
        message={message}
        type={messageType}
        setOpen={setMessageOpen}
      /> */}
    </div>
  );
};

export { Community };
