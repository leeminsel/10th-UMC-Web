import axios, { type InternalAxiosRequestConfig } from "axios";
import { LOCAL_STORAGE_KEY } from "../constants/key";

interface CustomInternalAxiosRequestConfig extends InternalAxiosRequestConfig {
    _retry?:boolean;
}

let refreshPromise: Promise<string | void> | null = null;

export const axiosInstance=axios.create({
    baseURL:import.meta.env.VITE_SERVER_API_URL,
})

const getToken = (key: string): string | null => {
    try {
        const raw = localStorage.getItem(key);
        if (!raw) return null;
        try {
            return JSON.parse(raw); // useLocalStorage가 JSON.stringify로 저장한 경우
        } catch {
            return raw; // plain string으로 저장된 경우 fallback
        }
    } catch {
        return null;
    }
};

const setToken = (key: string, value: string) => {
    localStorage.setItem(key, JSON.stringify(value));
};

const removeToken = (key: string) => {
    localStorage.removeItem(key);
};

axiosInstance.interceptors.request.use((config) => {
    const accessToken = getToken(LOCAL_STORAGE_KEY.accessToken);

    if (accessToken) {
        config.headers.set('Authorization', `Bearer ${accessToken}`);
    }

    return config;
},
(error) => Promise.reject(error),
)

axiosInstance.interceptors.response.use(
    (response) => response,
    async(error) => {
        const originalRequest:CustomInternalAxiosRequestConfig=error.config;

        const isRefreshRequest = originalRequest.url?.includes('/v1/auth/refresh');

        if(error.response && error.response.status===401 && !originalRequest._retry) {

            if(isRefreshRequest) {
                removeToken(LOCAL_STORAGE_KEY.accessToken);
                removeToken(LOCAL_STORAGE_KEY.refreshToken);
                window.location.href="/login";
                return Promise.reject(error);
            }

            originalRequest._retry=true;

            if(!refreshPromise) {
                refreshPromise=(async()=> {
                    const refreshToken = getToken(LOCAL_STORAGE_KEY.refreshToken);

                    const {data} = await axiosInstance.post('/v1/auth/refresh', {
                        refresh: refreshToken,
                    });

                    setToken(LOCAL_STORAGE_KEY.accessToken, data.data.accessToken);
                    setToken(LOCAL_STORAGE_KEY.refreshToken, data.data.refreshToken);

                    return data.data.accessToken as string;
                })()
                .catch(() => {
                    removeToken(LOCAL_STORAGE_KEY.accessToken);
                    removeToken(LOCAL_STORAGE_KEY.refreshToken);
                    window.location.href="/login";
                })
                .finally(() => {
                    refreshPromise = null;
                })
            }

            return refreshPromise.then((newAccessToken) => {
                if (!newAccessToken) return Promise.reject(error);
                originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
                return axiosInstance.request(originalRequest);
            });
        }
        return Promise.reject(error);
    }
)
