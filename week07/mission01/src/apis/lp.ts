import { axiosInstance } from './axios';
import type { ApiResponse, LpListResponse, LpItem } from '../types/lp';

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
