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
