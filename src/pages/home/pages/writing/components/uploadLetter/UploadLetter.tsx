import { useState, ChangeEvent, FC } from 'react';
import { Input, IconButton } from '@mui/material';
import { MdLibraryBooks } from 'react-icons/md';
import { fetchData } from '@myCommon/fetchData.ts';
import MessageSnackbar from '@myComponents/message/Message.tsx';

interface UploadAvatarProps {
  letter: string; // URL
  fetchLetterImage: () => Promise<void>;
}

const UploadAvatar: FC<UploadAvatarProps> = props => {
  const { fetchLetterImage } = props;

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
        fetchLetterImage();
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
    <div className="btn">
      <IconButton component="label" htmlFor="letter-input">
        <MdLibraryBooks />
        <Input id="letter-input" type="file" onChange={handleFileChange} style={{ display: 'none' }} />
      </IconButton>
      对比
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
