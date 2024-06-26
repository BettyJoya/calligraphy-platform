import { useEffect, useCallback } from 'react';
import localforage from 'localforage';
import { useDispatch } from 'react-redux';
import { loginAction } from '@myStore/slices/loginSlice.ts';
import { useNavigate } from 'react-router-dom';
export const useLoginState = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const verifyLoginState = useCallback(async () => {
    try {
      const time = await localforage.getItem<number>('time');
      if (location.pathname === '/') {
        navigate('/home/copyBook');
      }
      // 如果时间戳不存在或者时间戳加七天小于当前时间戳，就将登录状态设置为 logout
      if (!time || time + 7 * 24 * 60 * 60 * 1000 < Date.now()) {
        navigate('/home/personal');
      } else {
        dispatch(loginAction());
      }
    } catch (error) {
      return null;
    }
  }, [dispatch, navigate]);
  useEffect(() => {
    verifyLoginState();
  }, [verifyLoginState]);
};
