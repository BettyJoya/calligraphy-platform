import { FC } from 'react';
import './bookCard.css';
import CopyBookImg from '../../../../../../assets/copybook.jpg';

const BookCard: FC = () => {
  return (
    <div className="book-card">
      <div className="card-img">
        <img src={CopyBookImg} alt="" />
      </div>
      <div className="card-text">
        <h3>上善若水</h3>
        <p>作者：王羲之</p>
      </div>
    </div>
  );
};

export { BookCard };
