import { FC, useEffect } from 'react';
import HeadImg from '../../../../assets/headImg.jpg';
import './personal.css';
import { useNavigate, useParams } from 'react-router-dom';

const Personal: FC = () => {
  return (
    <div className="personal">
      <div className="base-info">
        <img src={HeadImg} alt="头像" />
        <div className="text-info">
          {/* <h1>登录/注册</h1> */}
          <h1>BettyJoya</h1>
          <p>BettyJoya的个人简介BettyJoya的个人简介BettyJoya的个人简介</p>
          <div className="more">
            <div className="more-item">
              <span>关注：</span>
              <span>0</span>
            </div>
            <div className="more-item">
              <span>粉丝：</span>
              <span>0</span>
            </div>
            <div className="more-item">
              <span>作品：</span>
              <span>0</span>
            </div>
          </div>
        </div>
      </div>
      <PersonalContent></PersonalContent>
    </div>
  );
};

const PersonalContent: FC = () => {
  const param = useParams();
  const navigate = useNavigate();
  useEffect(() => {
    if (!param.kind) {
      navigate('/home/personal/record');
    }
  });
  const changeKind = (kind: string) => {
    return () => {
      if (param.kind !== kind) {
        navigate(`/home/personal/${kind}`);
      }
    };
  };
  return (
    <div className="personal-content">
      <div className="personal-nav">
        <div className={param.kind === 'collect' ? 'nav-item active' : 'nav-item'} onClick={changeKind('collect')}>
          我的收藏
        </div>
        <div className={param.kind === 'record' ? 'nav-item active' : 'nav-item'} onClick={changeKind('record')}>
          浏览记录
        </div>
        <div className={param.kind === 'work' ? 'nav-item active' : 'nav-item'} onClick={changeKind('work')}>
          我的作品
        </div>
      </div>
      <div className="personal-main">
        {param.kind === 'record' ? (
          <div className="record">暂无浏览记录</div>
        ) : param.kind === 'collect' ? (
          <div className="collect">暂无收藏</div>
        ) : (
          <div className="work">暂无作品</div>
        )}
      </div>
    </div>
  );
};

export { Personal, PersonalContent };
