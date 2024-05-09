import { FC, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { CollectDetail } from '../../../types.ts';
import { fetchData } from '@myCommon/fetchData.ts';
import { MdArrowBack, MdDownload } from 'react-icons/md';
import './wodeDetail.css';

const WodeDetail: FC = () => {
  const navigate = useNavigate();
  const param = useParams();
  const [collectDetail, setCollectDetail] = useState<CollectDetail | undefined>(undefined);
  useEffect(() => {
    const getCollectDetail = async () => {
      try {
        const res = await fetchData('GET', {
          url: `http://localhost:3001/api/collects/detail/${param.id}`
        });
        if (res.code === 200) {
          setCollectDetail(res.data as CollectDetail);
        } else {
          throw new Error(res.data as string);
        }
      } catch (error) {
        if (error instanceof Error) {
          console.log(error.message);
        }
      }
    };
    getCollectDetail();
  }, [param.id]);
  const handleBackClick = () => {
    window.history.back();
  };

  const handleClickImage = (id: string) => () => {
    navigate(`/home/writing/letterId=${id}`);
  };

  const handleClickDownload = () => {
    // 创建一个新的 Canvas 元素
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    // 设置 Canvas 尺寸
    canvas.width = 500; // 设置为你想要的长宽
    canvas.height = collectDetail?.letters.length ? canvas.width * collectDetail?.letters.length : canvas.width;

    let yOffset = 0;

    // 遍历 imagelist 中的所有图片，并将其绘制到 Canvas 上
    collectDetail?.letters.forEach(letter => {
      const img = new Image();
      img.src = `data:image/png;base64,${letter.pic}`;
      console.log(img.src);

      img.onload = () => {
        const width = canvas.width;
        const height = img.width;
        ctx?.drawImage(img, 0, yOffset, width, height);
        yOffset += 10; // 每张图片之间的间隔，可以根据需要调整
      };
    });

    // 检查 canvas 是否为空
    if (!ctx) {
      console.error('Canvas context is null.');
      return;
    }

    // 将 Canvas 转换为图片并下载
    canvas.toBlob(blob => {
      if (blob) {
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'image.png'; // 可以设置你想要的文件名
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
    }, 'image/png');
  };
  return (
    <div className="wode-collect-detail">
      <div className="detail-header">
        <div className="btn" onClick={handleBackClick}>
          <MdArrowBack />
        </div>
        <h3 className="title">{collectDetail?.title}</h3>
        <div className="operate">
          <div className="btn" onClick={handleClickDownload}>
            <MdDownload />
          </div>
        </div>
      </div>
      <div className="detail-image-list">
        {collectDetail?.title.split('').map(item => {
          const letter = collectDetail?.letters.find(letter => letter.title === item);
          return (
            <div key={letter!.title} className="image-item" onClick={handleClickImage(letter!.id)}>
              <img src={`data:image/png;base64,${letter?.pic}`} alt={letter?.title} />
            </div>
          );
        })}
      </div>
    </div>
  );
};

export { WodeDetail };
