import { LOCAL_STORAGE_KEY } from "../constants/key";
import type { RequestSignupDto, RequestSigninDto, ResponseSignupDto, ResponseSigninDto, ResponseMyInfoDto, RequestUpdateMyInfoDto, ResponseUpdateMyInfoDto } from "../types/auth";
import { axiosInstance } from "./axios";

export const postSignup=async(body:RequestSignupDto):Promise<ResponseSignupDto> => {
    const{data}=await axiosInstance.post("/v1/auth/signup",body);
    return data;
}

export const postSignin=async(body:RequestSigninDto):Promise<ResponseSigninDto> => {
    const{data}=await axiosInstance.post("/v1/auth/signin",body);
    return data;
}

export const getMyInfo=async():Promise<ResponseMyInfoDto> => {
    const{data}= await axiosInstance.get("/v1/users/me", {
        headers: {
            Authorization: `Bearer ${localStorage.getItem(LOCAL_STORAGE_KEY.accessToken)}`
        }
    })
    return data;
}

export const updateMyInfo = async (body: RequestUpdateMyInfoDto): Promise<ResponseUpdateMyInfoDto> => {
    const { data } = await axiosInstance.patch("/v1/users", body);
    return data;
};

export const postLogout=async()=> {
    const{data}=await axiosInstance.post("/v1/auth/signout");
    return data;
}

// 탈퇴 api 추가
export const deleteAccount=async(): Promise<void> => {
    await axiosInstance.delete("/v1/users");
}
