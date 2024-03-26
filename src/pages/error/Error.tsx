import { FC } from 'react';
import ErrorImg from '../../assets/error.png';
import './error.css';

const Error: FC = () => {
  return (
    <div className="error-container">
      <img src={ErrorImg} alt="404" />
    </div>
  );
};

export { Error };
