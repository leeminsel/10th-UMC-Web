export interface Tag { id: number; name: string; }
export interface Like { id: number; userId: number; lpId: number; }

export interface CommentAuthor {
  id: number;
  name: string;
  email: string;
  bio: string | null;
  avatar: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface Comment {
  id: number;
  content: string;
  lpId: number;
  authorId: number;
  author: CommentAuthor;
  createdAt: string;
  updatedAt: string;
}

export interface CommentListResponse {
  data: Comment[];
  nextCursor: number | null;
  hasNext: boolean;
}

export interface LpItem {
  id: number;
  authorId:number;
  title: string;
  content: string;
  thumbnail: string;
  tags: Tag[];
  likes: Like[];
  createdAt: string;
}

export interface LpListResponse {
  data: LpItem[];
  nextCursor: number | null;
  hasNext: boolean;
}

export interface ApiResponse<T> {
  status: boolean;
  data: T;
}