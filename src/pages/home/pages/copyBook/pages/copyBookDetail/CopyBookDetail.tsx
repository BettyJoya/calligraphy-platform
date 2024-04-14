import { FC, useEffect, useState } from 'react';
import './copyBookDetail.css';
import {
  MdArrowBack,
  MdFavoriteBorder,
  // MdOutlineFavorite,
  MdOutlineStarBorder,
  MdOutlineStar,
  MdOutlineIosShare
} from 'react-icons/md';
import { useParams } from 'react-router-dom';
import { fetchData } from '@myCommon/fetchData.ts';

interface CopyBookDetail {
  id: string;
  name: string;
  author: string;
  mainPic: string;
  description: string;
  isCollected: number;
}

const CopyBookDetail: FC = () => {
  const param = useParams();
  const [copyBookDetail, setCopyBookDetail] = useState<CopyBookDetail | undefined>(undefined);
  const [mainImg, setMainImg] = useState<string>('');

  const handleBackClick = () => {
    window.history.back();
  };

  useEffect(() => {
    const copyBookDetailFetch = async () => {
      try {
        const res = await fetchData<string | CopyBookDetail>('GET', {
          url: `http://localhost:3001/api/copybook/copybook-detail/${param.id}`
        });
        if (res.code === 200) {
          setCopyBookDetail(res.data as CopyBookDetail);
          setMainImg(`data:image/img;base64,${(res.data as CopyBookDetail).mainPic}`);
        } else {
          throw new Error(res.data as string);
        }
      } catch (error) {
        if (error instanceof Error) {
          console.log(error.message);
        }
      }
    };

    copyBookDetailFetch();
  }, [param.id]);

  const handleCollect = async () => {
    try {
      const res = await fetchData(
        'POST',
        {
          url: `http://localhost:3001/api/copybook/collect`,
          headers: {
            'Content-Type': 'application/json'
          }
        },
        {
          copybookId: param.id,
          isCollected: copyBookDetail?.isCollected === 1 ? 0 : 1
        }
      );
      if (res.code === 200) {
        setCopyBookDetail(prev => {
          if (prev) {
            return {
              ...prev,
              isCollected: prev.isCollected === 1 ? 0 : 1
            };
          }
          return prev;
        });
      } else {
        throw new Error(res.data as string);
      }
    } catch (error) {
      if (error instanceof Error) {
        console.log(error.message);
      }
    }
  };

  return (
    <div className="copy-book-detail">
      <div className="copy-book-detail-header">
        <div className="btn" onClick={handleBackClick}>
          <MdArrowBack />
        </div>
        <h3 className="title">{copyBookDetail?.name}</h3>
        <div className="operate">
          <div className="btn">
            <MdFavoriteBorder />
          </div>
          <div className="btn" onClick={handleCollect}>
            {copyBookDetail?.isCollected === 1 ? <MdOutlineStar /> : <MdOutlineStarBorder />}
          </div>
          <div className="btn">
            <MdOutlineIosShare />
          </div>
        </div>
      </div>
      <div className="copy-book-detail-content">
        <div className="img">
          <img src={mainImg} alt="" />
        </div>
        <div className="author">{copyBookDetail?.author}</div>
        <div className="content">
          <h4>介绍：</h4>
          <p>{copyBookDetail?.description}</p>
        </div>
      </div>
      <div className="copy-book-detail-footer">
        <div className="footer-btn">临帖</div>
      </div>
    </div>
  );
};

export { CopyBookDetail };
