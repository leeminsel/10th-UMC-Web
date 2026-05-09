export interface Tag { id: number; name: string; }
export interface Like { id: number; userId: number; lpId: number; }

export interface LpItem {
  id: number;
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