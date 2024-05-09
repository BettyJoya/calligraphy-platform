export interface ArticleInfo {
  content: string;
  title: string;
  id: string;
  letter_pic: string;
  user_pic: string;
  user_avatar: string;
  user_name: string;
  is_like: string;
  is_collect: string;
  likes_count: string;
  collects_count: string;
}

export interface WorkInfo {
  id: string;
  userName: string;
  userAvatar: string;
  title: string;
  mainPic: string;
  isLike: boolean;
  likeCount: number;
}

export interface ArticleInfoDetail extends ArticleInfo {
  // commentCount: number;
  is_attention: boolean;
  user_email: string;
  similarity: string;
  font_type: string;
  source_book: string;
}

export interface CommentInfo {
  id: string;
  user_email: string;
  user_name: string;
  user_avatar: string;
  content: string;
  create_time: string;
}
