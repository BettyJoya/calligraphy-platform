import { FC, useCallback, useEffect, useRef, useState } from 'react';
import {
  MdAddComment,
  MdArrowBack,
  MdFavorite,
  MdFavoriteBorder,
  MdOutlineIosShare,
  MdOutlineStar,
  MdOutlineStarBorder
} from 'react-icons/md';
// import { useParams } from 'react-router-dom';
import { ArticleInfoDetail, CommentInfo } from '../../types.ts';
import { Button, Drawer, Fab } from '@mui/material';
import './userWorkDetail.css';
import { useParams } from 'react-router-dom';
import { fetchData } from '@myCommon/fetchData.ts';
import MessageSnackbar from '@myComponents/message/Message.tsx';
import moment from 'moment';

interface Paper {
  drawImage(image: HTMLImageElement, width: number, height: number): void;
  adjustCanvasSize(): void;
  canvas: HTMLCanvasElement | null;
  context: CanvasRenderingContext2D | null;
  init(canvas: HTMLCanvasElement): void;
  drawPaper(): void;
  drawDotted(sx: number, sy: number, ex: number, ey: number): void;
}

const UserWorkDetail: FC = () => {
  const param = useParams();
  const id = param.id;
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const userCanvasRef = useRef<HTMLCanvasElement>(null);
  const [articleDetail, setArticleDetail] = useState<ArticleInfoDetail | undefined>(undefined);
  const [commentList, setCommentList] = useState<CommentInfo[]>([]);
  const [openDrawer, setOpenDrawer] = useState<boolean>(false);
  const [commentText, setCommentText] = useState<string>('');
  const [messageOpen, setMessageOpen] = useState<boolean>(false);
  const [message, setMessage] = useState<string>('');
  const [messageType, setMessageType] = useState<'success' | 'error' | 'info' | 'warning'>('success');
  const toggleDrawer = (open: boolean) => (event: React.KeyboardEvent | React.MouseEvent) => {
    if (
      event &&
      event.type === 'keydown' &&
      ((event as React.KeyboardEvent).key === 'Tab' || (event as React.KeyboardEvent).key === 'Shift')
    ) {
      return;
    }
    setOpenDrawer(open);
  };
  const createPaper: (imageUrl: string) => Paper = useCallback((imageUrl: string) => {
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
        this.canvas!.width = Math.min(400, window.innerWidth - window.innerWidth * 0.2 - 200);
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
  }, []);
  const getCommentList = useCallback(async () => {
    try {
      const res = await fetchData(
        'POST',
        {
          url: 'http://localhost:3001/api/comments/list'
        },
        {
          article_id: articleDetail?.id
        }
      );
      if (res.code === 200) {
        const data = res.data as { comments: CommentInfo[] };
        setCommentList(data.comments);
      } else {
        throw new Error(res.data as string);
      }
    } catch (error) {
      if (error instanceof Error) {
        console.log(error.message);
      }
    }
  }, [articleDetail?.id]);
  const getArticleDetail = useCallback(async () => {
    try {
      const res = await fetchData(
        'POST',
        {
          url: `http://localhost:3001/api/articles/get-article-detail`
        },
        {
          article_id: id
        }
      );
      if (res.code === 200) {
        const data = res.data as { articleDetail: ArticleInfoDetail };
        setArticleDetail(data.articleDetail);
        getCommentList();
      } else {
        throw new Error(res.data as string);
      }
    } catch (error) {
      if (error instanceof Error) {
        console.log(error.message);
      }
    }
  }, [getCommentList, id]);

  useEffect(() => {
    getArticleDetail();

    const canvas = canvasRef.current;
    const userCanvas = userCanvasRef.current;
    if (canvas) {
      const paper = createPaper(articleDetail?.letter_pic ? `data:image/png;base64,${articleDetail?.letter_pic}` : '');
      paper.init(canvas);
    }
    if (userCanvas) {
      const paper = createPaper(articleDetail?.user_pic ? `data:image/png;base64,${articleDetail?.user_pic}` : '');
      paper.init(userCanvas);
    }
  }, [articleDetail?.letter_pic, articleDetail?.user_pic, createPaper, getArticleDetail, getCommentList]);
  const handleBackClick = () => {
    window.history.back();
  };

  const likeFetch = async () => {
    try {
      const res = await fetchData(
        'POST',
        {
          url: 'http://localhost:3001/api/articles/like-article'
        },
        {
          article_id: articleDetail?.id
        }
      );
      if (res.code === 200) {
        getArticleDetail();
      } else {
        throw new Error(res.data as string);
      }
    } catch (error) {
      if (error instanceof Error) {
        console.log(error.message);
      }
    }
  };

  const handleLike = () => {
    likeFetch();
  };

  const collectFetch = async () => {
    try {
      const res = await fetchData(
        'POST',
        {
          url: 'http://localhost:3001/api/articles/collect-article'
        },
        {
          article_id: articleDetail?.id
        }
      );
      if (res.code === 200) {
        getArticleDetail();
      } else {
        throw new Error(res.data as string);
      }
    } catch (error) {
      if (error instanceof Error) {
        console.log(error.message);
      }
    }
  };

  const handleCollect = () => {
    collectFetch();
  };

  const attentionFetch = async () => {
    try {
      const res = await fetchData(
        'POST',
        {
          url: 'http://localhost:3001/api/attentions/add'
        },
        {
          user_email: articleDetail?.user_email
        }
      );
      if (res.code === 200) {
        getArticleDetail();
      } else {
        throw new Error(res.data as string);
      }
    } catch (error) {
      if (error instanceof Error) {
        console.log(error.message);
      }
    }
  };
  const handleAttention = () => {
    attentionFetch();
  };

  const commentFetch = async () => {
    try {
      const res = await fetchData(
        'POST',
        {
          url: 'http://localhost:3001/api/comments/add'
        },
        {
          article_id: articleDetail?.id,
          content: commentText
        }
      );
      if (res.code === 200) {
        getArticleDetail();
        setCommentText('');
      } else {
        throw new Error(res.data as string);
      }
    } catch (error) {
      if (error instanceof Error) {
        console.log(error.message);
      }
    }
  };
  const handleComment = () => {
    if (!commentText) {
      setMessageOpen(true);
      setMessageType('warning');
      setMessage('评论内容不能为空');
      return;
    }
    commentFetch();
  };
  const handleShare = () => {
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
  return (
    <div className="user-work-detail">
      <div className="user-work-detail-header">
        <div className="btn" onClick={handleBackClick}>
          <MdArrowBack />
        </div>
        <div className="user">
          <div className="info">
            {articleDetail?.user_avatar ? (
              <img className="user-img" src={`data:image/png;base64,${articleDetail?.user_avatar}`} />
            ) : (
              <div className="user-img"></div>
            )}
            <div className="user-name">{articleDetail?.user_name}</div>
          </div>
          <div className="attention">
            {articleDetail?.is_attention === true ? (
              <Button className="outlined-btn" variant="outlined" onClick={handleAttention}>
                已关注
              </Button>
            ) : (
              <Button className="contained-btn" variant="contained" onClick={handleAttention}>
                关注
              </Button>
            )}
          </div>
        </div>
      </div>
      <div className="article-content">
        <div className="writing-canvas">
          <canvas ref={canvasRef} id="canvas">
            您的浏览器不支持 Canvas
          </canvas>
        </div>
        <div className="article-info">
          <p>相似度：</p>
          <p>{articleDetail?.similarity}</p>
        </div>
        <div className="writing-canvas">
          <canvas ref={userCanvasRef} id="user-canvas">
            您的浏览器不支持 Canvas
          </canvas>
        </div>
      </div>
      <div className="article-info">
        <div className="article-title">
          <h2>{articleDetail?.title}</h2>
          <span>
            {articleDetail?.font_type === '1'
              ? '楷书'
              : articleDetail?.font_type === '2'
                ? '行书'
                : articleDetail?.font_type === '3'
                  ? '草书'
                  : articleDetail?.font_type === '4'
                    ? '隶书'
                    : '篆'}
          </span>
          <span>{articleDetail?.source_book}</span>
        </div>
        <p>{articleDetail?.content}</p>
      </div>
      <div className="operate">
        <Fab className="btn" variant="extended" onClick={handleLike}>
          {articleDetail?.is_like ? <MdFavorite /> : <MdFavoriteBorder />}
        </Fab>
        <Fab className="btn" variant="extended" onClick={handleCollect}>
          {articleDetail?.is_collect ? <MdOutlineStar /> : <MdOutlineStarBorder />}
        </Fab>
        <Fab className="btn" variant="extended" onClick={toggleDrawer(true)}>
          <MdAddComment />
        </Fab>
        <Fab className="btn" variant="extended" onClick={handleShare}>
          <MdOutlineIosShare />
        </Fab>
      </div>
      <Drawer anchor="right" open={openDrawer} onClose={toggleDrawer(false)}>
        <div className="comment-drawer">
          <div className="comment-list">
            {commentList.length === 0 ? (
              <div className="no-comment">暂无评论</div>
            ) : (
              commentList.map(comment => (
                <div className="comment-item" key={comment.id}>
                  <div className="user-info">
                    {comment.user_avatar ? (
                      <img className="user-img" src={`data:image/png;base64,${comment.user_avatar}`} />
                    ) : (
                      <div className="user-img"></div>
                    )}
                    <div className="user-name">{comment.user_name}</div>
                  </div>
                  <div className="comment-content">{comment.content}</div>
                  <div className="comment-time">{moment(comment.create_time).format('YYYY-MM-DD HH:mm:ss')}</div>
                </div>
              ))
            )}
          </div>
          <div className="comment-input">
            <input
              type="text"
              placeholder="请输入评论"
              value={commentText}
              onChange={e => setCommentText(e.target.value)}
            />
            <Button className="contained-btn" variant="contained" onClick={handleComment}>
              评论
            </Button>
          </div>
        </div>
      </Drawer>
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

export { UserWorkDetail };
