import { useState, ChangeEvent, FC } from 'react';
import { Input, Avatar, IconButton } from '@mui/material';
import PhotoCameraIcon from '@mui/icons-material/PhotoCamera';
import { fetchData } from '@myCommon/fetchData.ts';
import MessageSnackbar from '@myComponents/message/Message.tsx';

interface UploadAvatarProps {
  avatar: string; // 头像 URL
  fetchUserInfo: () => Promise<void>;
}

const UploadAvatar: FC<UploadAvatarProps> = props => {
  const { avatar, fetchUserInfo } = props;

  const [messageOpen, setMessageOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState<'success' | 'error' | 'info' | 'warning'>('success');

  const handleFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    const formData = new FormData();
    formData.append('avatar', file as File);

    try {
      const res = await fetchData(
        'POST',
        {
          url: 'http://localhost:3001/api/users/change-avatar',
          headers: {
            'Content-Type': ''
          }
        },
        formData
      );
      if (res.code === 200) {
        setMessage('修改成功');
        setMessageType('success');
        setMessageOpen(true);
        fetchUserInfo();
      } else {
        throw new Error(res.data as string);
      }
    } catch (error) {
      if (error instanceof Error) {
        setMessageOpen(true);
        setMessageType('error');
        setMessage(error.message);
      }
    }
  };
  return (
    <div style={{ position: 'relative', display: 'inline-block' }}>
      {/* 使用传递的头像 URL 设置 Avatar 组件的 src 属性 */}
      <Avatar src={avatar} alt="Avatar" sx={{ width: 150, height: 150 }} />
      <IconButton component="label" htmlFor="avatar-input" style={{ position: 'absolute', bottom: 0, right: 0 }}>
        <PhotoCameraIcon />
        <Input id="avatar-input" type="file" onChange={handleFileChange} style={{ display: 'none' }} />
      </IconButton>
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

export default UploadAvatar;
