import { FC } from 'react';
import { CopyBookInfo } from '../../types.ts';
import './bookCard.css';

interface BookCardProps {
  info: CopyBookInfo;
  onBookClick?: () => void;
}

const BookCard: FC<BookCardProps> = ({ info, onBookClick }) => {
  return (
    <div className="book-card" onClick={onBookClick}>
      <div className="card-img">
        <img src={`data:image/png;base64,${info.mainPic}`} alt="" />
      </div>
      <div className="card-text">
        <h3>{info.name}</h3>
        <p>{info.author}</p>
      </div>
    </div>
  );
};

export { BookCard };
