import { ChangeEvent, FC, useCallback, useEffect, useRef, useState } from 'react';
import './writingDetail.css';
import {
  MdArrowBack,
  // MdFavoriteBorder,
  // MdOutlineFavorite,
  // MdOutlineStarBorder,
  // MdOutlineStar,
  MdOutlineIosShare,
  MdLibraryBooks,
  MdDownload
} from 'react-icons/md';
import { fetchData } from '@myCommon/fetchData.ts';
import { useParams } from 'react-router-dom';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
  Input
} from '@mui/material';
import { useSelector } from 'react-redux';
import { selectLogin } from '@myStore/slices/loginSlice.ts';
import MessageSnackbar from '@myComponents/message/Message.tsx';
import { ErrorMessage } from '@myCommon/errorMessage.ts';

interface LetterDetail {
  id: string;
  title: string;
  fontType: string;
  pic: string;
  isCollected: number;
}
interface Paper {
  drawImage(image: HTMLImageElement, width: number, height: number): void;
  adjustCanvasSize(): void;
  canvas: HTMLCanvasElement | null;
  context: CanvasRenderingContext2D | null;
  init(canvas: HTMLCanvasElement): void;
  drawPaper(): void;
  drawDotted(sx: number, sy: number, ex: number, ey: number): void;
}

const WritingDetail: FC = () => {
  const loginState = useSelector(selectLogin);
  const param = useParams();
  const id = param.id?.split('=')[1] || '';
  const [loading, setLoading] = useState<boolean>(true);
  const [letterDetail, setLetterDetail] = useState<LetterDetail | undefined>(undefined);
  const [mainImg, setMainImg] = useState<string>('');
  const [userImage, setUserImage] = useState<string>('');
  const [showUserCanvas, setShowUserCanvas] = useState<boolean>(false);
  const [similarity, setSimilarity] = useState<string>('');
  const [showSimilarity, setShowSimilarity] = useState<boolean>(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const userCanvasRef = useRef<HTMLCanvasElement>(null);
  const [mainPaper, setMainPaper] = useState<Paper | undefined>(undefined);
  const [userPaper, setUserPaper] = useState<Paper | undefined>(undefined);
  const [messageOpen, setMessageOpen] = useState<boolean>(false);
  const [message, setMessage] = useState<string>('');
  const [messageType, setMessageType] = useState<'success' | 'error'>('success');
  const [open, setOpen] = useState<boolean>(false);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const [descriptionText, setDescriptionText] = useState<string>('');
  const [userFileName, setUserFileName] = useState<string>('');
  const [articleTitle, setArticleTitle] = useState<string>('');

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleBackClick = () => {
    window.history.back();
  };
  // const handleCollect = () => {
  //   if (letterDetail) {
  //     setLetterDetail({
  //       ...letterDetail,
  //       isCollected: letterDetail.isCollected === 1 ? 0 : 1
  //     });
  //   }
  // };

  const createPaper: (imageUrl: string) => Paper = useCallback(
    (imageUrl: string) => {
      const paper: Paper = {
        canvas: null,
        context: null,
        init(canvas: HTMLCanvasElement): void {
          this.canvas = canvas;
          this.context = canvas.getContext('2d');

          this.adjustCanvasSize();
          this.drawPaper();

          // 监听窗口大小变化
          window.addEventListener('resize', () => {
            this.adjustCanvasSize();
            this.drawPaper();
          });
        },
        adjustCanvasSize(): void {
          this.canvas!.width = !showUserCanvas
            ? Math.min(600, window.innerWidth - window.innerWidth * 0.2)
            : Math.min(400, window.innerWidth - window.innerWidth * 0.2 - 200);
          this.canvas!.height = this.canvas!.width;
        },
        drawPaper(): void {
          // 清空 Canvas
          this.context!.clearRect(0, 0, this.canvas!.width, this.canvas!.height);

          // 浅灰色实线边框
          this.context!.strokeStyle = '#ccc';
          this.context!.lineWidth = 1;
          this.context!.strokeRect(0, 0, this.canvas!.width, this.canvas!.height);

          // 红色实线四个角
          this.context!.strokeStyle = 'red';
          this.context!.lineWidth = 2;
          this.context!.beginPath();
          this.context!.moveTo(10, 10);
          this.context!.lineTo(25, 10);
          this.context!.moveTo(10, 10);
          this.context!.lineTo(10, 25);
          this.context!.moveTo(this.canvas!.width - 10, 10);
          this.context!.lineTo(this.canvas!.width - 25, 10);
          this.context!.moveTo(this.canvas!.width - 10, 10);
          this.context!.lineTo(this.canvas!.width - 10, 25);
          this.context!.moveTo(10, this.canvas!.height - 10);
          this.context!.lineTo(25, this.canvas!.height - 10);
          this.context!.moveTo(10, this.canvas!.height - 10);
          this.context!.lineTo(10, this.canvas!.height - 25);
          this.context!.moveTo(this.canvas!.width - 10, this.canvas!.height - 10);
          this.context!.lineTo(this.canvas!.width - 25, this.canvas!.height - 10);
          this.context!.moveTo(this.canvas!.width - 10, this.canvas!.height - 10);
          this.context!.lineTo(this.canvas!.width - 10, this.canvas!.height - 25);
          this.context!.stroke();

          // 红色虚线边框，四周各留20像素
          this.context!.strokeStyle = 'red';
          this.context!.lineWidth = 1;
          this.drawDotted(20, 20, this.canvas!.width - 20, 20);
          this.drawDotted(20, 20, 20, this.canvas!.height - 20);
          this.drawDotted(this.canvas!.width - 20, 20, this.canvas!.width - 20, this.canvas!.height - 20);
          this.drawDotted(20, this.canvas!.height - 20, this.canvas!.width - 20, this.canvas!.height - 20);
          this.drawDotted(20, 20, this.canvas!.width - 20, this.canvas!.height - 20);
          this.drawDotted(this.canvas!.width - 20, 20, 20, this.canvas!.height - 20);
          this.drawDotted(this.canvas!.width / 2, 20, this.canvas!.width / 2, this.canvas!.height - 20);
          this.drawDotted(20, this.canvas!.height / 2, this.canvas!.width - 20, this.canvas!.height / 2);
          // 绘制图片
          const image = new Image();
          image.src = imageUrl; // 你的图片地址
          image.onload = () => {
            const width = this.canvas!.width - 40;
            const height = width;
            this.drawImage(image, width, height);
          };
        },
        drawDotted(sx: number, sy: number, ex: number, ey: number): void {
          const lineInterval: number = 5;
          this.context!.save();

          if (this.context?.setLineDash) {
            this.context!.setLineDash([lineInterval, lineInterval]);
            this.context!.moveTo(sx, sy);
            this.context!.lineTo(ex, ey);
          } else {
            const len: number = Math.ceil(Math.sqrt((ex - sx) * (ex - sx) + (ey - sy) * (ey - sy)) / lineInterval / 2);
            const lineIntervalX: number = (ex - sx) / len;
            const lineIntervalY: number = (ey - sy) / len;
            let index: number = 0;

            this.context!.beginPath();
            while (index < len) {
              const targetX: number = sx + lineIntervalX;
              const targetY: number = sy + lineIntervalY;
              this.context!.moveTo(sx, sy);
              this.context!.lineTo(targetX, targetY);
              sx = targetX + lineIntervalX;
              sy = targetY + lineIntervalY;
              index++;
            }
          }

          this.context!.stroke();
          this.context!.restore();
        },

        drawImage(image: HTMLImageElement, width: number, height: number): void {
          const x = (this.canvas!.width - width) / 2;
          const y = (this.canvas!.height - height) / 2;
          this.context!.drawImage(image, x, y, width, height);
        }
      };
      return paper;
    },
    [showUserCanvas]
  );

  useEffect(() => {
    const letterDetailFetch = async () => {
      try {
        const res = await fetchData<string | LetterDetail>('GET', {
          url: `http://localhost:3001/api/letters/letter-detail/${id}`
        });
        if (res.code === 200) {
          setLetterDetail(res.data as LetterDetail);
          setMainImg(`data:image/img;base64,${(res.data as LetterDetail).pic}`);
        } else {
          throw new Error(res.data as string);
        }
      } catch (error) {
        if (error instanceof Error) {
          console.log(error.message);
        }
      }
    };

    letterDetailFetch();

    if (canvasRef.current) {
      const canvas = canvasRef.current;
      // setMainPaper(createPaper(mainImg));
      mainPaper?.init(canvas);
    }

    return () => {
      window.removeEventListener('resize', () => {
        mainPaper?.adjustCanvasSize();
        mainPaper?.drawPaper();
        userPaper?.adjustCanvasSize();
        userPaper?.drawPaper();
      });
    };
  }, [id, mainPaper, userPaper]);

  useEffect(() => {
    setMainPaper(createPaper(mainImg));
  }, [createPaper, mainImg]);

  useEffect(() => {
    if (userImage && userCanvasRef.current) {
      const canvas = userCanvasRef.current;
      const paper: Paper = createPaper(userImage);
      paper.init(canvas);
      setUserPaper(paper);
    }
  }, [createPaper, userImage]);

  const handleFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
    if (loginState !== 'login') {
      setMessageOpen(true);
      setMessageType('error');
      setMessage('请先登录');
      return;
    }
    const file = event.target.files?.[0];
    const reader = new FileReader();

    reader.onload = e => {
      setUserImage(e.target?.result as string);
    };

    reader.readAsDataURL(file as File);

    setShowUserCanvas(true);
    const formData = new FormData();
    formData.append('writingLetter', file as File);
    setShowSimilarity(true);
    setLoading(true);

    try {
      const res = await fetchData<
        {
          writingLetterFileName: string;
        },
        FormData
      >(
        'POST',
        {
          url: 'http://localhost:3001/api/letters/upload',
          headers: {
            'Content-Type': ''
          }
        },
        formData
      );
      if (res.code === 200) {
        console.log('成功', res.data);
        setUserFileName(res.data.writingLetterFileName);
        const result = await fetchData<{ result: string }, { writingLetterFileName: string; letterId: string }>(
          'POST',
          {
            url: 'http://localhost:3001/api/letters/compare'
          },
          {
            writingLetterFileName: res.data.writingLetterFileName,
            letterId: id
          }
        );

        if (result.code === 200) {
          setSimilarity(result.data?.result);
        }

        // setMessage('修改成功');
        // setMessageType('success');
        // setMessageOpen(true);
      } else {
        throw new Error(res.data as string);
      }
    } catch (error) {
      if (error instanceof Error) {
        console.log(error.message);

        // setMessageOpen(true);
        // setMessageType('error');
        // setMessage(error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = () => {
    if (loginState !== 'login') {
      setMessageOpen(true);
      setMessageType('error');
      setMessage('请先登录');
      return;
    }
    const canvas = canvasRef.current;
    if (canvas) {
      const a = document.createElement('a');
      a.href = canvas.toDataURL();
      a.download = `${letterDetail?.title}.png`;
      a.click();
    }
  };

  const copyURL = () => {
    const url = window.location.href;
    const input = document.createElement('input');
    input.value = url;
    document.body.appendChild(input);
    input.select();
    document.execCommand('copy');
    document.body.removeChild(input);
    setMessageOpen(true);
    setMessageType('success');
    setMessage('复制URL成功');
  };
  const handleShareClick = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleChangeText = (event: ChangeEvent<HTMLTextAreaElement>) => {
    setDescriptionText(event.target.value);
  };

  const onHandleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData();
    formData.append('content', descriptionText);
    formData.append('letterId', id);
    formData.append('writingLetterFileName', userFileName);
    formData.append('title', articleTitle);
    try {
      const res = await fetchData<
        string,
        {
          content: string;
          letter_id: string;
          user_file_name: string;
          title: string;
          similarity: string;
        }
      >(
        'POST',
        {
          url: 'http://localhost:3001/api/articles/add-article'
        },
        {
          content: descriptionText,
          letter_id: id,
          user_file_name: userFileName,
          title: articleTitle,
          similarity
        }
      );
      if (res.code === 200) {
        handleClose();
      } else {
        ErrorMessage('发布失败', 2000);
      }
    } catch (err) {
      ErrorMessage('发布失败', 2000);
    }
  };

  return (
    <div className="writing-detail">
      <div className="detail-header">
        <div className="btn" onClick={handleBackClick}>
          <MdArrowBack />
        </div>
        <h3 className="title">{letterDetail?.title}</h3>
        <div className="operate">
          {/* <div className="btn">
            <MdFavoriteBorder />
          </div>
          <div className="btn" onClick={handleCollect}>
            {letterDetail?.isCollected === 1 ? <MdOutlineStar /> : <MdOutlineStarBorder />}
          </div> */}
          <div className="btn" onClick={copyURL}>
            <MdOutlineIosShare />
          </div>
        </div>
      </div>
      <div className="writing-content">
        <div className="writing-canvas">
          <canvas ref={canvasRef} id="canvas">
            您的浏览器不支持 Canvas
          </canvas>
        </div>
        <div className="operation-btn">
          <IconButton disableTouchRipple className="btn" component="label" htmlFor="letter-input">
            <MdLibraryBooks />
            <Input id="letter-input" type="file" onChange={handleFileChange} style={{ display: 'none' }} />
            对比
          </IconButton>
          <div className="btn" onClick={handleDownload}>
            <MdDownload />
            下载
          </div>
        </div>
        {showUserCanvas && (
          <div className="writing-canvas">
            <canvas ref={userCanvasRef} id="user-canvas">
              您的浏览器不支持 Canvas
            </canvas>
          </div>
        )}
      </div>
      {showSimilarity && (
        <div className="similarity">
          {loading && (
            <div className="loader">
              <div className="circle a"></div>
              <div className="circle b"></div>
              <div className="circle c"></div>
              <div className="circle d"></div>
              <div className="circle e"></div>
            </div>
          )}
          <span>相似度：</span>
          <span>{loading ? '计算中...' : similarity}</span>
        </div>
      )}
      {showSimilarity && !loading && (
        <div className="footer-btn" onClick={handleShareClick}>
          分享到社区
        </div>
      )}
      <Dialog
        className="login-dialog"
        open={open}
        onClose={handleClose}
        PaperProps={{
          component: 'form',
          onSubmit: onHandleSubmit
        }}
      >
        <DialogTitle>分享临摹作品</DialogTitle>
        <DialogContent className="dialog-content">
          <DialogContentText>请添加标题</DialogContentText>
          <textarea
            cols={30}
            rows={1}
            id="collecting-textarea"
            onChange={e => {
              setArticleTitle(e.target.value);
            }}
          />
          <DialogContentText>请添加描述内容</DialogContentText>
          <textarea
            ref={inputRef}
            name="collecting"
            id="collecting-textarea"
            value={descriptionText}
            cols={30}
            rows={5}
            maxLength={200}
            onChange={handleChangeText}
          ></textarea>
        </DialogContent>
        <DialogActions className="btn-actions">
          <Button className="btn" variant="contained" onClick={handleClose}>
            取消
          </Button>
          <Button className="btn" variant="contained" type="submit">
            发布
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
    </div>
  );
};

export { WritingDetail };
