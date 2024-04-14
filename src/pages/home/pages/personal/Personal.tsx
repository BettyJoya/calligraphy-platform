import { FC, useEffect, useState } from 'react';
// import HeadImg from '../../../../assets/head.png';
import './personal.css';
import { useNavigate, useParams } from 'react-router-dom';
import { Login } from '../login/Login.tsx';
import { useDispatch, useSelector } from 'react-redux';
import { selectLogin, logoutAction } from '@myStore/slices/loginSlice.ts';
import { useLoginState } from '../../../../hooks/useLoginState.ts';
import type { UserInfo } from './types.ts';
import { fetchData } from '@myCommon/fetchData.ts';
import { IconButton } from '@mui/material';
import { MdExitToApp } from 'react-icons/md';
import localforage from 'localforage';
import { EditInfo } from './components/editInfo/EditInfo.tsx';
import UploadAvatar from '@myComponents/uploadImage/UploadImage.tsx';
import { Collect } from './pages/collect/Collect.tsx';
import { Record } from './pages/record/Record.tsx';
import MessageSnackbar from '@myComponents/message/Message.tsx';

const Personal: FC = () => {
  useLoginState();
  const dispatch = useDispatch();
  const loginState = useSelector(selectLogin);
  const [open, setOpen] = useState(false);
  const [userInfo, setUserInfo] = useState<UserInfo>({
    email: '',
    name: '',
    avatar: '',
    description: '',
    attention_count: 0,
    fans_count: 0,
    work_count: 0
  });
  const fetchUserInfo = async () => {
    const res = await fetchData<string | UserInfo>('GET', {
      url: 'http://localhost:3001/api/users/self-info'
    });
    if (typeof res.data !== 'string') {
      setUserInfo(res.data);
    }
  };
  const handleExit = () => {
    localforage.removeItem('token');
    localforage.removeItem('time');
    dispatch(logoutAction());
  };
  useEffect(() => {
    if (loginState === 'login') {
      fetchUserInfo();
    }
  }, [loginState]);
  return (
    <div className="personal">
      <div className="base-info">
        {/* <img src={HeadImg} alt="头像" style={{ backgroundColor: 'var(--main-background-color)' }} /> */}
        <UploadAvatar avatar={`data:image/img;base64,${userInfo?.avatar}`} fetchUserInfo={fetchUserInfo} />
        {loginState === 'login' ? (
          <>
            <div className="text-info">
              <div className="name-ope">
                <h1>{userInfo.name}</h1>
                <EditInfo open={open} setOpen={setOpen} fetchUserInfo={fetchUserInfo} />
                <IconButton className="btn" aria-label="exit" onClick={handleExit}>
                  <MdExitToApp />
                </IconButton>
              </div>
              <p>个性签名：{userInfo.description}</p>
              <div className="more">
                <div className="more-item">
                  <span>关注：</span>
                  <span>{userInfo.attention_count}</span>
                </div>
                <div className="more-item">
                  <span>粉丝：</span>
                  <span>{userInfo.fans_count}</span>
                </div>
                <div className="more-item">
                  <span>作品：</span>
                  <span>{userInfo.work_count}</span>
                </div>
              </div>
            </div>
          </>
        ) : (
          <Login />
        )}
      </div>
      <PersonalContent></PersonalContent>
    </div>
  );
};

const PersonalContent: FC = () => {
  const loginState = useSelector(selectLogin);
  const param = useParams();
  const navigate = useNavigate();
  const [messageOpen, setMessageOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState<'success' | 'error' | 'info' | 'warning'>('success');

  useEffect(() => {
    if (!param.kind) {
      navigate('/home/personal/record');
    }
  }, [navigate, param.kind]);
  const changeKind = (kind: string) => {
    return () => {
      if (loginState !== 'login') {
        setMessage('请先登录');
        setMessageType('error');
        setMessageOpen(true);
        return;
      }
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
          <Record />
        ) : param.kind === 'collect' ? (
          <Collect />
        ) : (
          <div className="work">暂无作品</div>
        )}
      </div>
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

export { Personal, PersonalContent };
