import { axiosInstance } from './axios';
import type { ApiResponse, LpListResponse, LpItem, Comment, CommentListResponse } from '../types/lp';

export const fetchLpList = async (cursor?: number, search?: string, order: string = 'desc') => {
  const { data } = await axiosInstance.get<ApiResponse<LpListResponse>>('/v1/lps', {
    params: { cursor, search, order, limit: 10 },
  });
  return data.data;
};

export const fetchLpDetail = async (id: string) => {
  const { data } = await axiosInstance.get<ApiResponse<LpItem>>(`/v1/lps/${id}`);
  return data.data;
};

export const uploadImage = async (file: File): Promise<string> => {
  const formData = new FormData();
  formData.append('file', file);
  const { data } = await axiosInstance.post<{ data: { imageUrl: string } }>('/v1/uploads/public', formData);
  return data.data.imageUrl;
};

export interface RequestCreateLpDto {
  title: string;
  content: string;
  thumbnail: string;
  tags: string[];
  published: boolean;
}

export const createLp = async (body: RequestCreateLpDto): Promise<LpItem> => {
const { data } = await axiosInstance.post<ApiResponse<LpItem>>('/v1/lps', body);
  return data.data;
};

export const fetchComments = async (lpId: string, cursor?: number): Promise<CommentListResponse> => {
  const { data } = await axiosInstance.get<ApiResponse<CommentListResponse>>(
    `/v1/lps/${lpId}/comments`,
    { params: { cursor, limit: 20, order: 'desc' } }
  );
  return data.data;
};

export const createComment = async (lpId: string, content: string): Promise<Comment> => {
  const { data } = await axiosInstance.post<Comment>(
    `/v1/lps/${lpId}/comments`,
    { content }
  );
  return data;
};

export const updateComment = async (lpId: string, commentId: number, content: string): Promise<Comment> => {
  const { data } = await axiosInstance.patch<ApiResponse<Comment>>(
    `/v1/lps/${lpId}/comments/${commentId}`,
    { content }
  );
  return data.data;
};

export const deleteComment = async (lpId: string, commentId: number): Promise<void> => {
  await axiosInstance.delete(`/v1/lps/${lpId}/comments/${commentId}`);
};

// LP 수정
export const updateLp = async (lpId: string, body: Partial<RequestCreateLpDto>) => {
  const { data } = await axiosInstance.patch<ApiResponse<LpItem>>(`/v1/lps/${lpId}`, body);
  return data.data;
};

// LP 삭제
export const deleteLp = async (lpId: string) => {
  await axiosInstance.delete(`/v1/lps/${lpId}`);
};

export const likeLp = async (lpId: string) => {
  const { data } = await axiosInstance.post<ApiResponse<{ isLiked: boolean }>>(`/v1/lps/${lpId}/likes`);
  return data.data;
};

export const unlikeLp = async (lpId: string) => {
  const { data } = await axiosInstance.delete<ApiResponse<{ isLiked: boolean }>>(`/v1/lps/${lpId}/likes`);
  return data.data;
};