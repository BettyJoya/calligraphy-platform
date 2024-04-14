import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Button from '@mui/material/Button';
import { IconButton, TextField } from '@mui/material';
import { FaRegEdit } from 'react-icons/fa';
import { useState } from 'react';
import './editInfo.css';
import { fetchData } from '@myCommon/fetchData.ts';
import MessageSnackbar from '@myComponents/message/Message.tsx';

interface EditInfoProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  fetchUserInfo: () => Promise<void>;
}

const EditInfo = (props: EditInfoProps) => {
  const { open, setOpen, fetchUserInfo } = props;
  const [messageOpen, setMessageOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState<'success' | 'error' | 'info' | 'warning'>('success');
  const [nameError, setNameError] = useState(false);
  const [nameErrorMsg, setNameErrorMsg] = useState('');
  const [editFormData, setEditFormData] = useState({
    name: '',
    description: ''
  });

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditFormData({
      ...editFormData,
      [name]: value
    });
  };

  const handleClose = () => {
    setOpen(false);
  };

  const validateForm = () => {
    let isError = false;
    if (!editFormData.name) {
      setNameError(true);
      setNameErrorMsg('请输入姓名');
      isError = true;
    } else {
      setNameError(false);
      setNameErrorMsg('');
    }
    return isError;
  };

  const changeInfoFetch = async (formData: { name: string; description: string }) => {
    try {
      const res = await fetchData(
        'POST',
        {
          url: 'http://localhost:3001/api/users/change-info',
          headers: {
            'Content-Type': 'application/json'
          }
        },
        formData
      );
      if (res.code === 200) {
        setMessage('修改成功');
        setMessageType('success');
        setMessageOpen(true);
        setOpen(false);
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
  const onHandleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (validateForm()) {
      return;
    }
    console.log(editFormData);
    changeInfoFetch(editFormData);
  };

  return (
    <>
      <IconButton className="btn" aria-label="edit" onClick={handleClickOpen}>
        <FaRegEdit />
      </IconButton>
      <Dialog
        className="edit-dialog"
        open={open}
        onClose={handleClose}
        PaperProps={{
          component: 'form',
          onSubmit: onHandleSubmit
        }}
      >
        <DialogTitle>编辑个人资料</DialogTitle>
        <DialogContent>
          <TextField
            className="edit-input"
            margin="dense"
            id="name"
            name="name"
            label="Name"
            type="text"
            fullWidth
            variant="standard"
            helperText={nameError ? nameErrorMsg : ''}
            error={nameError}
            onChange={handleInputChange}
          />
          <TextField
            className="edit-input"
            margin="dense"
            id="description"
            name="description"
            label="Description"
            type="text"
            fullWidth
            multiline
            maxRows={4}
            variant="standard"
            onChange={handleInputChange}
          />
        </DialogContent>
        <DialogActions className="btn-actions">
          <Button className="btn" variant="contained" onClick={handleClose}>
            取消
          </Button>
          <Button className="btn" variant="contained" type="submit">
            提交
          </Button>
        </DialogActions>
      </Dialog>
      <MessageSnackbar
        vertical="top"
        horizontal="center"
        open={messageOpen}
        message={message}
        type={messageType}
        setOpen={setMessageOpen}
      />
    </>
  );
};

export { EditInfo };
