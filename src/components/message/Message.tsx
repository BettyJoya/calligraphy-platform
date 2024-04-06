import Snackbar, { SnackbarOrigin } from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';

interface Props {
  vertical: SnackbarOrigin['vertical'];
  horizontal: SnackbarOrigin['horizontal'];
  open: boolean;
  message: string;
  type: 'success' | 'error' | 'info' | 'warning';
  setOpen: (open: boolean) => void;
}

export default function MessageSnackbar(props: Props) {
  const { vertical, horizontal, open, message, type, setOpen } = props;

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <Snackbar
      anchorOrigin={{ vertical, horizontal }}
      open={open}
      autoHideDuration={1000}
      onClose={handleClose}
      key={vertical + horizontal}
    >
      <Alert onClose={handleClose} severity={type} variant="filled" sx={{ width: '100%' }}>
        {message}
      </Alert>
    </Snackbar>
  );
}
