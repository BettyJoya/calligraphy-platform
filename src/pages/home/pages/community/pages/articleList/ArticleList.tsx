import { FC, useEffect, useCallback, useState } from 'react';
import { fetchData } from '@myCommon/fetchData.ts';
import { UserWorkCard } from '../../components/userWorkCard/UserWorkCard.tsx';
import { ArticleInfo } from '../../types.ts';
import { useNavigate } from 'react-router-dom';
import './articleList.css';
import MessageSnackbar from '@myComponents/message/Message.tsx';
import { useSelector } from 'react-redux';
import { selectLogin } from '@myStore/slices/loginSlice.ts';

const ArticleList: FC<{
  type: 'attention' | 'new' | 'like' | 'collect' | 'my';
}> = ({ type }) => {
  const navigate = useNavigate();
  const loginState = useSelector(selectLogin);
  const [messageOpen, setMessageOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState<'success' | 'error'>('success');
  const [articleList, setArticleList] = useState<ArticleInfo[]>([]);
  const getNewArticleList = useCallback(async () => {
    try {
      const res = await fetchData<{ articles: ArticleInfo[] }>('GET', {
        url: 'http://localhost:3001/api/articles/get-all-articles'
      });
      if (res.code === 200) {
        setArticleList(res.data.articles);
      } else {
        throw new Error('获取文章失败');
      }
    } catch (err) {
      if (err instanceof Error) {
        setMessage(err.message);
        setMessageType('error');
        setMessageOpen(true);
      }
    }
  }, []);
  const getArticleList = useCallback(async () => {
    try {
      const res = await fetchData<{ articles: ArticleInfo[] }>('GET', {
        url: `http://localhost:3001/api/articles/get-${type}-articles`
      });
      if (res.code === 200) {
        setArticleList(res.data.articles);
      } else if (res.code === 401) {
        setMessage('请先登录');
        setMessageType('error');
        setMessageOpen(true);
      } else {
        throw new Error('获取文章失败');
      }
    } catch (err) {
      if (err instanceof Error) {
        setMessage(err.message);
        setMessageType('error');
        setMessageOpen(true);
      }
    }
  }, [type]);
  useEffect(() => {
    if (type !== 'new') {
      if (loginState !== 'login') {
        setMessage('请先登录');
        setMessageType('error');
        setMessageOpen(true);
        return;
      }
      getArticleList();
    } else {
      getNewArticleList();
    }
  }, [type, getNewArticleList, getArticleList, loginState]);

  const handleCardClick = (id: string) => {
    return () => {
      navigate(`/home/community/${id}`);
    };
  };
  return (
    <div>
      {articleList.length === 0 ? (
        <div>暂无文章</div>
      ) : (
        <div className="article-list">
          {articleList.map(article => (
            <UserWorkCard key={article.id} articleInfo={article} onCardClick={handleCardClick(article.id)} />
          ))}
          <i></i>
          <i></i>
          <i></i>
          <i></i>
          <i></i>
        </div>
      )}
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

export { ArticleList };
