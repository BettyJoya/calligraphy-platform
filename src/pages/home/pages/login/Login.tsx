import * as React from 'react';
import { FC } from 'react';
import { useDispatch } from 'react-redux';
import { loginAction } from '@myStore/slices/loginSlice.ts';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import IconButton from '@mui/material/IconButton';
import Input from '@mui/material/Input';
import InputLabel from '@mui/material/InputLabel';
import InputAdornment from '@mui/material/InputAdornment';
import FormControl from '@mui/material/FormControl';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import Link from '@mui/material/Link';
import './login.css';
import { fetchData } from '@myCommon/fetchData.ts';
import JSEncrypt from 'jsencrypt';
import localforage from 'localforage';
import { FormHelperText } from '@mui/material';
import MessageSnackbar from '@myComponents/message/Message.tsx';

const encryptor = new JSEncrypt();

const Login: FC = () => {
  const dispatch = useDispatch();
  const [open, setOpen] = React.useState(false);
  const [registerOpen, setRegisterOpen] = React.useState(false);
  const [forgetOpen, setForgetOpen] = React.useState(false);
  const [showPassword, setShowPassword] = React.useState(false);
  const [showRegisterPassword, setShowRegisterPassword] = React.useState(false);
  const [showRegisterConfirmPassword, setShowRegisterConfirmPassword] = React.useState(false);
  const [loginFormData, setLoginFormData] = React.useState<{ [k: string]: string }>({});
  const [loginEmailError, setLoginEmailError] = React.useState(false);
  const [loginEmailErrorMsg, setLoginEmailErrorMsg] = React.useState('');
  const [loginPasswordError, setLoginPasswordError] = React.useState(false);
  const [loginPasswordErrorMsg, setLoginPasswordErrorMsg] = React.useState('');
  const [registerFormData, setRegisterFormData] = React.useState<{ [k: string]: string }>({});
  const [registerEmailError, setRegisterEmailError] = React.useState(false);
  const [registerEmailErrorMsg, setRegisterEmailErrorMsg] = React.useState('');
  const [registerNameError, setRegisterNameError] = React.useState(false);
  const [registerNameErrorMsg, setRegisterNameErrorMsg] = React.useState('');
  const [registerPasswordError, setRegisterPasswordError] = React.useState(false);
  const [registerPasswordErrorMsg, setRegisterPasswordErrorMsg] = React.useState('');
  const [registerConfirmPasswordError, setRegisterConfirmPasswordError] = React.useState(false);
  const [registerConfirmPasswordErrorMsg, setRegisterConfirmPasswordErrorMsg] = React.useState('');
  const [registerVertificationWordError, setRegisterVertificationWordError] = React.useState(false);
  const [registerVertificationWordErrorMsg, setRegisterVertificationWordErrorMsg] = React.useState('');
  const [messageOpen, setMessageOpen] = React.useState(false);
  const [message, setMessage] = React.useState('');
  const [messageType, setMessageType] = React.useState<'success' | 'error' | 'info' | 'warning'>('success');

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleClickRegisterOpen = () => {
    setRegisterOpen(true);
  };

  const handleRegisterClose = () => {
    setRegisterEmailError(false);
    setRegisterNameError(false);
    setRegisterPasswordError(false);
    setRegisterConfirmPasswordError(false);
    setRegisterVertificationWordError(false);
    setRegisterOpen(false);
  };

  const handleClickForgetOpen = () => {
    setForgetOpen(true);
  };

  const handleForgetClose = () => {
    setForgetOpen(false);
  };

  const handleClickShowPassword = () => setShowPassword(show => !show);
  const handleClickShowRegisterPassword = () => setShowRegisterPassword(show => !show);
  const handleClickShowRegisterConfirmPassword = () => setShowRegisterConfirmPassword(show => !show);

  const handleMouseDownPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
  };

  // 更新表单状态
  const handleLoginInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setLoginFormData(prevFormData => ({
      ...prevFormData,
      [name]: value
    }));
  };

  const handleRegisterInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setRegisterFormData(prevFormData => ({
      ...prevFormData,
      [name]: value
    }));
  };

  const getEncrypted = async (password: string) => {
    // 获取公钥
    const publicKey = await fetchData<{ publicKey: string }>('GET', {
      url: 'http://localhost:3001/api/users/get-publick-key'
    });
    console.log(publicKey);
    if (publicKey.code !== 200) {
      throw new Error('server error');
    }
    encryptor.setPublicKey(publicKey.data.publicKey);
    if (typeof encryptor.getPublicKey() === 'boolean') {
      throw new Error('encryptor error');
    }
    if (typeof encryptor.encrypt(password) === 'string') {
      return encryptor.encrypt(password) as string;
    } else {
      throw new Error('encryptor error');
    }
  };

  const validateLoginEmail = (email: string) => {
    if (!email) {
      setLoginEmailError(true);
      setLoginEmailErrorMsg('邮箱不能为空！');
      return false;
    }
    const emailReg = /^(\w-*\.*)+@(\w-?)+(\.\w{2,})+$/;
    if (!emailReg.test(email)) {
      setLoginEmailError(true);
      setLoginEmailErrorMsg('请输入有效的邮箱地址！');
      return false;
    }
    setLoginEmailError(false);
    setLoginEmailErrorMsg('');
    return true;
  };

  const validateLoginPassword = (password: string) => {
    if (!password) {
      setLoginPasswordError(true);
      setLoginPasswordErrorMsg('密码不能为空！');
      return false;
    }
    setLoginPasswordError(false);
    setLoginPasswordErrorMsg('');
    return true;
  };

  const loginFetch = async (formJson: { [k: string]: string }) => {
    try {
      if (!validateLoginEmail(formJson.email as string)) {
        return;
      }
      if (!validateLoginPassword(formJson.password as string)) {
        return;
      }
      const encryptedPassword = await getEncrypted(formJson.password as string);
      const res = await fetchData<{ time: number; token: string }, { email: string; password: string }>(
        'POST',
        {
          url: 'http://localhost:3001/api/users/login',
          headers: {
            'Content-Type': 'application/json'
          }
        },
        {
          email: formJson.email as string,
          password: encryptedPassword
        }
      );
      if (res.code === 200) {
        localforage.setItem('time', res.data.time);
        localforage.setItem('token', res.data.token);
        dispatch(loginAction());
        setMessageOpen(true);
        setMessageType('success');
        setMessage('登录成功！');
        // // 刷新页面
        // window.location.reload();
      } else if (res.code === 503) {
        throw new Error('邮箱或密码错误！');
      } else if (res.code === 505) {
        throw new Error('用户不存在！');
      } else {
        throw new Error('server error');
      }
      handleClose();
    } catch (error) {
      if (error instanceof Error) {
        setMessageOpen(true);
        setMessageType('error');
        setMessage(error.message);
      }
    }
  };

  const onHandleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    loginFetch(loginFormData);
  };

  const validateEmail = (email: string) => {
    if (!email) {
      setRegisterEmailError(true);
      setRegisterEmailErrorMsg('邮箱不能为空！');
      return false;
    }
    const emailReg = /^(\w-*\.*)+@(\w-?)+(\.\w{2,})+$/;
    if (!emailReg.test(email)) {
      setRegisterEmailError(true);
      setRegisterEmailErrorMsg('请输入有效的邮箱地址！');
      return false;
    }
    setRegisterEmailError(false);
    setRegisterEmailErrorMsg('');
    return true;
  };

  const validateName = (name: string) => {
    if (!name) {
      setRegisterNameError(true);
      setRegisterNameErrorMsg('用户名不能为空！');
      return false;
    }
    setRegisterNameError(false);
    setRegisterNameErrorMsg('');
    return true;
  };

  const validatePassword = (password: string) => {
    if (!password) {
      setRegisterPasswordError(true);
      setRegisterPasswordErrorMsg('密码不能为空！');
      return false;
    }
    setRegisterPasswordError(false);
    setRegisterPasswordErrorMsg('');
    return true;
  };

  const validateConfirmPassword = (confirmPassword: string) => {
    if (!confirmPassword) {
      setRegisterConfirmPasswordError(true);
      setRegisterConfirmPasswordErrorMsg('确认密码不能为空！');
      return false;
    }
    if (confirmPassword !== registerFormData.password) {
      setRegisterConfirmPasswordError(true);
      setRegisterConfirmPasswordErrorMsg('两次密码不一致！');
      return false;
    }
    setRegisterConfirmPasswordError(false);
    setRegisterConfirmPasswordErrorMsg('');
    return true;
  };

  const validateVertificationWord = (vertificationWord: string) => {
    if (!vertificationWord) {
      setRegisterVertificationWordError(true);
      setRegisterVertificationWordErrorMsg('验证字符不能为空！');
      return false;
    }
    setRegisterVertificationWordError(false);
    setRegisterVertificationWordErrorMsg('');
    return true;
  };

  const registerFetch = async (formData: { [k: string]: string }) => {
    // 校验
    if (!validateEmail(formData.email)) {
      return;
    }
    if (!validateName(formData.name)) {
      return;
    }
    if (!validatePassword(formData.password)) {
      return;
    }
    if (!validateConfirmPassword(formData.confirm_password)) {
      return;
    }
    if (!validateVertificationWord(formData.vertificationWord)) {
      return;
    }

    try {
      const encryptedPassword = await getEncrypted(formData.password);
      const encryptedCertifyCharacters = await getEncrypted(formData.vertificationWord);
      const res = await fetchData<never, { email: string; password: string; name: string; vertificationWord: string }>(
        'POST',
        {
          url: 'http://localhost:3001/api/users/register',
          headers: {
            'Content-Type': 'application/json'
          }
        },
        {
          email: formData.email,
          password: encryptedPassword,
          name: formData.name,
          vertificationWord: encryptedCertifyCharacters
        }
      );
      if (res.code === 200) {
        setMessageOpen(true);
        setMessageType('success');
        setMessage('注册成功！');
      } else {
        throw new Error(res.data);
      }
      handleRegisterClose();
    } catch (error) {
      if (error instanceof Error) {
        setMessageOpen(true);
        setMessageType('error');
        setMessage(error.message);
      }
    }
  };

  const onHandleRegisterSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    // 阻止冒泡
    event.stopPropagation();
    registerFetch(registerFormData);
  };

  return (
    <React.Fragment>
      <div className="text" onClick={handleClickOpen}>
        <h1>登录/注册</h1>
      </div>
      <Dialog
        className="login-dialog"
        open={open}
        onClose={handleClose}
        PaperProps={{
          component: 'form',
          onSubmit: onHandleSubmit
        }}
      >
        <DialogTitle>登录</DialogTitle>
        <DialogContent>
          <DialogContentText>欢迎登录！</DialogContentText>
          <TextField
            className="login-input"
            autoFocus
            margin="dense"
            id="name"
            name="email"
            label="Email Address"
            type="text"
            fullWidth
            variant="standard"
            helperText={loginEmailError ? loginEmailErrorMsg : ''}
            error={loginEmailError}
            onChange={handleLoginInputChange}
          />
          <FormControl className="login-input" fullWidth error={loginPasswordError} variant="standard">
            <InputLabel htmlFor="standard-adornment-password">Password</InputLabel>
            <Input
              id="standard-adornment-password"
              name="password"
              type={showPassword ? 'text' : 'password'}
              endAdornment={
                <InputAdornment position="end">
                  <IconButton
                    className="icon-btn"
                    aria-label="toggle password visibility"
                    onClick={handleClickShowPassword}
                    onMouseDown={handleMouseDownPassword}
                  >
                    {showPassword ? <Visibility /> : <VisibilityOff />}
                  </IconButton>
                </InputAdornment>
              }
              onChange={handleLoginInputChange}
            />
            {loginPasswordError && <FormHelperText error>{loginPasswordErrorMsg}</FormHelperText>}
          </FormControl>
          <div className="forget">
            <Link className="forget-btn" href="#" underline="none" onClick={handleClickForgetOpen}>
              忘记密码
            </Link>
            <Dialog
              className="login-dialog"
              open={forgetOpen}
              onClose={handleForgetClose}
              PaperProps={{
                component: 'form',
                onSubmit: (event: React.FormEvent<HTMLFormElement>) => {
                  event.preventDefault();
                  const formData = new FormData(event.currentTarget);
                  const formJson = Object.fromEntries(formData.entries());
                  const email = formJson.email;
                  console.log(email);
                  handleForgetClose();
                }
              }}
            >
              <DialogTitle>重置密码</DialogTitle>
              <DialogContent>
                <DialogContentText>欢迎登录！</DialogContentText>
                <TextField
                  className="login-input"
                  autoFocus
                  margin="dense"
                  id="name"
                  name="email"
                  label="Email Address"
                  type="email"
                  fullWidth
                  variant="standard"
                />
                <FormControl className="login-input" fullWidth variant="standard">
                  <InputLabel htmlFor="standard-adornment-password">Password</InputLabel>
                  <Input
                    id="standard-adornment-password"
                    type={showPassword ? 'text' : 'password'}
                    endAdornment={
                      <InputAdornment position="end">
                        <IconButton
                          aria-label="toggle password visibility"
                          onClick={handleClickShowPassword}
                          onMouseDown={handleMouseDownPassword}
                        >
                          {showPassword ? <Visibility /> : <VisibilityOff />}
                        </IconButton>
                      </InputAdornment>
                    }
                  />
                </FormControl>
              </DialogContent>
              <DialogActions>
                <Button onClick={handleForgetClose}>取消</Button>
                <Button type="submit">确定</Button>
              </DialogActions>
            </Dialog>
          </div>
        </DialogContent>
        <DialogActions className="btn-actions">
          <Button className="btn" variant="contained" onClick={handleClose}>
            取消
          </Button>
          <Button className="btn" variant="contained" type="submit">
            登录
          </Button>
        </DialogActions>
        <div className="footer">
          <Link className="register-btn" href="#" underline="none" onClick={handleClickRegisterOpen}>
            新用户注册
          </Link>
          <Dialog
            className="login-dialog"
            open={registerOpen}
            onClose={handleRegisterClose}
            PaperProps={{
              component: 'form',
              onSubmit: onHandleRegisterSubmit
            }}
          >
            <DialogTitle>新用户注册</DialogTitle>
            <DialogContent>
              <DialogContentText>欢迎注册！</DialogContentText>
              <TextField
                className="login-input"
                autoFocus
                margin="dense"
                id="email"
                name="email"
                label="Email Address"
                type="text"
                fullWidth
                variant="standard"
                helperText={registerEmailError ? registerEmailErrorMsg : ''}
                error={registerEmailError}
                onChange={handleRegisterInputChange}
              />
              <TextField
                className="login-input"
                autoFocus
                margin="dense"
                id="name"
                name="name"
                label="name"
                type="text"
                fullWidth
                variant="standard"
                helperText={registerNameError ? registerNameErrorMsg : ''}
                error={registerNameError}
                onChange={handleRegisterInputChange}
              />
              <FormControl className="login-input" fullWidth error={registerPasswordError} variant="standard">
                <InputLabel htmlFor="standard-adornment-password">Password</InputLabel>
                <Input
                  id="standard-adornment-password"
                  name="password"
                  type={showRegisterPassword ? 'text' : 'password'}
                  endAdornment={
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={handleClickShowRegisterPassword}
                        onMouseDown={handleMouseDownPassword}
                      >
                        {showRegisterPassword ? <Visibility /> : <VisibilityOff />}
                      </IconButton>
                    </InputAdornment>
                  }
                  onChange={handleRegisterInputChange}
                />
                {registerPasswordError && <FormHelperText error>{registerPasswordErrorMsg}</FormHelperText>}
              </FormControl>
              <FormControl className="login-input" fullWidth error={registerConfirmPasswordError} variant="standard">
                <InputLabel htmlFor="standard-adornment-password">Confirm Password</InputLabel>
                <Input
                  id="standard-adornment-password"
                  name="confirm_password"
                  type={showRegisterConfirmPassword ? 'text' : 'password'}
                  endAdornment={
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={handleClickShowRegisterConfirmPassword}
                        onMouseDown={handleMouseDownPassword}
                      >
                        {showRegisterConfirmPassword ? <Visibility /> : <VisibilityOff />}
                      </IconButton>
                    </InputAdornment>
                  }
                  onChange={handleRegisterInputChange}
                />
                {registerConfirmPasswordError && (
                  <FormHelperText error>{registerConfirmPasswordErrorMsg}</FormHelperText>
                )}
              </FormControl>
              <TextField
                className="login-input"
                autoFocus
                margin="dense"
                id="vertificationWord"
                name="vertificationWord"
                label="Vertification Word"
                type="text"
                fullWidth
                variant="standard"
                helperText={registerVertificationWordError ? registerVertificationWordErrorMsg : ''}
                error={registerVertificationWordError}
                onChange={handleRegisterInputChange}
              />
            </DialogContent>
            <DialogActions className="btn-actions">
              <Button className="btn" onClick={handleRegisterClose}>
                取消
              </Button>
              <Button className="btn" type="submit">
                注册
              </Button>
            </DialogActions>
          </Dialog>
        </div>
      </Dialog>
      <MessageSnackbar
        vertical="top"
        horizontal="center"
        open={messageOpen}
        message={message}
        type={messageType}
        setOpen={setMessageOpen}
      />
    </React.Fragment>
  );
};

export { Login };
