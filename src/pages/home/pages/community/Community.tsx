// import MessageSnackbar from '@myComponents/message/Message';
import { FC, useState } from 'react';
import './community.css';

import { ArticleList } from './pages/articleList/ArticleList.tsx';
import { Outlet, useParams } from 'react-router-dom';

const Community: FC = () => {
  const param = useParams();
  const id = param.id;
  const [currentKind, setCurrentKind] = useState<'attention' | 'new'>('new');

  const changeKind = (kind: 'attention' | 'new') => {
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
          <div className={currentKind === 'new' ? 'nav-item active' : 'nav-item'} onClick={changeKind('new')}>
            最新
          </div>
          <div
            className={currentKind === 'attention' ? 'nav-item active' : 'nav-item'}
            onClick={changeKind('attention')}
          >
            关注
          </div>
        </div>
      </div>
      <div className="community-main">
        <ArticleList type={currentKind}></ArticleList>
      </div>
    </div>
  ) : (
    <Outlet />
  );
};

export { Community };
