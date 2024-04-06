import { FC } from 'react';
import './copyBookDetail.css';
import {
  MdArrowBack,
  MdFavoriteBorder,
  // MdOutlineFavorite,
  MdOutlineStarBorder,
  // MdOutlineStar,
  MdOutlineIosShare
} from 'react-icons/md';
import CopyBookImg from '../../../../../../assets/copybook.jpg';

const CopyBookDetail: FC = () => {
  const handleBackClick = () => {
    window.history.back();
  };
  return (
    <div className="copy-book-detail">
      <div className="copy-book-detail-header">
        <div className="btn" onClick={handleBackClick}>
          <MdArrowBack />
        </div>
        <h3 className="title">上善若水</h3>
        <div className="operate">
          <div className="btn">
            <MdFavoriteBorder />
          </div>
          <div className="btn">
            <MdOutlineStarBorder />
          </div>
          <div className="btn">
            <MdOutlineIosShare />
          </div>
        </div>
      </div>
      <div className="copy-book-detail-content">
        <div className="img">
          <img src={CopyBookImg} alt="" />
        </div>
        <div className="author">王羲之</div>
        <div className="content">
          <h4>介绍：</h4>
          <p>
            上善若水，水善利万物而不争，处众人之所恶，故几于道。居善地，心善渊，与善仁，言善信，正善治，事善能，动善时。夫唯不争，故无尤。
            上善若水，水善利万物而不争，处众人之所恶，故几于道。居善地，心善渊，与善仁，言善信，正善治，事善能，动善时。夫唯不争，故无尤。
            上善若水，水善利万物而不争，处众人之所恶，故几于道。居善地，心善渊，与善仁，言善信，正善治，事善能，动善时。夫唯不争，故无尤。
          </p>
        </div>
      </div>
      <div className="copy-book-detail-footer">
        <div className="footer-btn">临帖</div>
      </div>
    </div>
  );
};

export { CopyBookDetail };
