export interface Post {
  id: number | string;
  user_id?: string;
  user?: {
    username: string;
    avatar: string;
  };
  image_url: string;
  caption: string;
  likes: number;
  isLiked?: boolean;
  created_at: string;
  updated_at?: string;
}
