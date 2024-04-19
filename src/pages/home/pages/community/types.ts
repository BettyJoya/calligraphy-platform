export interface WorkInfo {
  id: string;
  userName: string;
  userAvatar: string;
  title: string;
  mainPic: string;
  isLike: boolean;
  likeCount: number;
}

export interface WorkInfoDetail extends WorkInfo {
  content: string;
  commentCount: number;
  isAttention: boolean;
  isCollected: boolean;
  collectCount: number;
  createTime: string;
}
