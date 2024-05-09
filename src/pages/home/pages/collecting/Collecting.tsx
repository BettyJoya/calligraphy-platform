import { ChangeEvent, FC, useEffect, useRef, useState } from 'react';
import './collecting.css';
import { Button } from '@mui/material';
import { Duilian } from './pages/duilian/Duilian.tsx';
import { Shiwen } from './pages/shiwen/Shiwen.tsx';
import { Wode } from './pages/wode/Wode.tsx';
import { Outlet, useNavigate, useParams } from 'react-router-dom';
import MessageSnackbar from '@myComponents/message/Message.tsx';

const Collecting: FC = () => {
  const param = useParams();
  const id = param.id;
  const [currentKind, setCurrentKind] = useState('wode');
  const changeKind = (kind: string) => {
    return () => {
      if (currentKind !== kind) {
        setCurrentKind(kind);
      }
    };
  };
  return !id ? (
    <div className="collecting">
      <div className="input-container">
        <CollectingInput />
      </div>
      <div className="collecting-nav-bar">
        <div className={currentKind === 'wode' ? 'nav-item active' : 'nav-item'} onClick={changeKind('wode')}>
          我的集字
        </div>
        {/* <div className={currentKind === 'shiwen' ? 'nav-item active' : 'nav-item'} onClick={changeKind('shiwen')}>
          诗文集字
        </div> */}
        {/* <div className={currentKind === 'duilian' ? 'nav-item active' : 'nav-item'} onClick={changeKind('duilian')}>
          对联集字
        </div> */}
      </div>
      <div className="community-main">
        {currentKind === 'wode' ? <Wode /> : currentKind === 'shiwen' ? <Shiwen /> : <Duilian />}
      </div>
    </div>
  ) : (
    <Outlet />
  );
};

export { Collecting };

const CollectingInput: FC = () => {
  const navigate = useNavigate();
  const [messageOpen, setMessageOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState<'success' | 'error' | 'info' | 'warning'>('success');
  const [collectingText, setCollectingText] = useState<string>('');
  const collectingRef = useRef<HTMLTextAreaElement>(null);
  useEffect(() => {
    collectingRef.current?.focus();
  }, []);
  const handleChangeText = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setCollectingText(e.target.value);
  };
  const handleGenerate = () => {
    if (!collectingText) {
      setMessage('请输入集字内容');
      setMessageType('error');
      setMessageOpen(true);
      return;
    }
    navigate(`/home/collecting/${collectingText}`);
  };
  return (
    <div className="collecting-input">
      <textarea
        ref={collectingRef}
        name="collecting"
        id="collecting-textarea"
        value={collectingText}
        cols={30}
        rows={5}
        maxLength={200}
        onChange={handleChangeText}
      ></textarea>
      <div className="collecting-operation-btn">
        <Button className="outlined-btn" variant="outlined">
          清除标点
        </Button>
        <p>{collectingText.length} / 200</p>
        <Button className="contained-btn" variant="contained" onClick={handleGenerate}>
          生成集字
        </Button>
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
