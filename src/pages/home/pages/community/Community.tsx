// import MessageSnackbar from '@myComponents/message/Message';
import { FC, useState } from 'react';
import './community.css';

import { Attention } from './pages/attention/Attention.tsx';
import { Recommend } from './pages/recommend/Recommend.tsx';
import { New } from './pages/new/New.tsx';
import { Outlet, useParams } from 'react-router-dom';

const Community: FC = () => {
  // const navigate = useNavigate();
  const param = useParams();
  const id = param.id;
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

  return !id ? (
    <div className="community">
      <div className="nav-container">
        <div className="community-nav-bar">
          <div
            className={currentKind === 'attention' ? 'nav-item active' : 'nav-item'}
            onClick={changeKind('attention')}
          >
            关注
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
        {currentKind === 'attention' ? <Attention /> : currentKind === 'recommend' ? <Recommend /> : <New />}
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
  ) : (
    <Outlet />
  );
};

export { Community };
