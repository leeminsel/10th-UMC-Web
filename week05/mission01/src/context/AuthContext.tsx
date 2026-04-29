import { createContext, useContext, useState, type PropsWithChildren } from "react";
import type { RequestSigninDto } from "../types/auth";
import { LOCAL_STORAGE_KEY } from "../constants/key";
import { useLocalStorage } from "../hooks/useLocalStorage";
import { postSignin,postLogout } from "../apis/auth";


interface AuthContextType {
    accessToken:string|null;
    refreshToken:string|null;
    login:(signInDate:RequestSigninDto) => Promise<void>;
    logout:()=> Promise<void>;
}

export const AuthContext=createContext<AuthContextType>({
    accessToken:null,
    refreshToken:null,
    login:async() => {},
    logout:async() => {},
});


export const AuthProvider=({children}:PropsWithChildren) =>{
    
    const{
        getItem:getAccessTokenFromStorage,
        setItem:setAeccessTokenInStorgae,
        removeItem:removeAcceseeTokenFromStorage}= useLocalStorage(LOCAL_STORAGE_KEY.accessToken);
    const{
        getItem:getRefreshTokenFromStorage,
        setItem:setRefreshTokenInStorage,
        removeItem:removeRefreshTokenFromStorage}=useLocalStorage(LOCAL_STORAGE_KEY.refreshToken);

    const [accessToken, setAccessToken]=useState<string|null>(
        getAccessTokenFromStorage(),  //지연초기화
    )
    const [refreshToken, setRefreshToken]=useState<string|null>(
        getRefreshTokenFromStorage(),
    )
    const login=async(signinDate:RequestSigninDto) => {
        try{
            const{data}=await postSignin(signinDate);

        if(data) {
            const newAccessToken=data.accessToken
            const newRefreshToken=data.refreshToken;

            setAeccessTokenInStorgae(newAccessToken);
            setRefreshTokenInStorage(newRefreshToken);

            setAccessToken(newAccessToken);
            setRefreshToken(newRefreshToken);
            alert("로그인 성공");
            window.location.href="/my";
        }
        }catch(error){
            console.error("로그인 오류",error);
            alert("로그인 실패");
        }
    }
    const logout=async()=>{
        try{
            await postLogout();
            removeAcceseeTokenFromStorage();
            removeRefreshTokenFromStorage();

            setAccessToken(null);
            setRefreshToken(null);

            alert("로그아웃 성공");
        }catch(error){
            console.error("로그아웃 오류",error);
            alert("로그아웃 실패");
        }
    }

    return (
        <AuthContext.Provider value={{accessToken, refreshToken,login,logout}}>
            {children}
        </AuthContext.Provider>
    )
};

export const useAuth=()=> {
    const context=useContext(AuthContext);
    if(!context) {
        throw new Error("AutoContext를 찾을 수 없습니다.")
    }
    return context;
}