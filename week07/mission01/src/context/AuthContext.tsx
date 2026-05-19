import { createContext, useContext, useState, type PropsWithChildren } from "react";
import { LOCAL_STORAGE_KEY } from "../constants/key";
import { useLocalStorage } from "../hooks/useLocalStorage";
import {  postLogout } from "../apis/auth";


interface AuthContextType {
    accessToken: string|null;
    refreshToken: string|null;
    name: string|null;
    userId: number|null;
    login: (data: {accessToken: string; refreshToken: string; name:string; id:number}) => void;
    logout: () => Promise<void>;
    updateName: (newName: string) => void;
    clearAuth: () => void; //탈퇴
}

export const AuthContext=createContext<AuthContextType>({
    accessToken: null,
    refreshToken: null,
    name: null,
    userId: null,
    login: async() => {},
    logout: async() => {},
    updateName: () => {},
    clearAuth: () => {}
});


export const AuthProvider=({children}:PropsWithChildren) =>{

    const{ getItem:getAccessTokenFromStorage, setItem:setAccessTokenInStorage, removeItem:removeAccessTokenFromStorage }= useLocalStorage(LOCAL_STORAGE_KEY.accessToken);
    const{ getItem:getRefreshTokenFromStorage, setItem:setRefreshTokenInStorage, removeItem:removeRefreshTokenFromStorage }=useLocalStorage(LOCAL_STORAGE_KEY.refreshToken);
    const{ getItem:getNameFromStorage, setItem:setNameInStorage, removeItem:removeNameFromStorage }=useLocalStorage(LOCAL_STORAGE_KEY.name);
    const{ getItem:getUserIdFromStorage, setItem:setUserIdInStorage, removeItem:removeUserIdFromStorage }=useLocalStorage(LOCAL_STORAGE_KEY.userId);

    const [accessToken, setAccessToken]=useState<string|null>(getAccessTokenFromStorage());
    const [refreshToken, setRefreshToken]=useState<string|null>(getRefreshTokenFromStorage());
    const [name, setName]=useState<string|null>(getNameFromStorage());
    const [userId, setUserId]=useState<number|null>(getUserIdFromStorage() ? Number(getUserIdFromStorage()) : null);

    const clearAuth=()=> {
    removeAccessTokenFromStorage();
    removeRefreshTokenFromStorage();
    removeNameFromStorage();
    removeUserIdFromStorage();
    setAccessToken(null);
    setRefreshToken(null);
    setName(null);
    setUserId(null);
    }

    // asyne 제거, 파라미터 타입도 변경
    const login=(data: {accessToken: string; refreshToken: string; name: string; id:number}) => {
            console.log('[로그인 응답]', data);

            if(data) {
                setAccessTokenInStorage(data.accessToken);
                setRefreshTokenInStorage(data.refreshToken);
                setNameInStorage(data.name);
                setUserIdInStorage(String(data.id));

                setAccessToken(data.accessToken);
                setRefreshToken(data.refreshToken);
                setName(data.name);
                setUserId(data.id);

                
            }
    }

    const logout=async()=>{
        try{
            await postLogout();
            removeAccessTokenFromStorage();
            removeRefreshTokenFromStorage();
            removeNameFromStorage();
            removeUserIdFromStorage();

            setAccessToken(null);
            setRefreshToken(null);
            setName(null);
            setUserId(null);

            alert("로그아웃 성공");
        }catch(error){
            console.error("로그아웃 오류",error);
            alert("로그아웃 실패");
        }
    }

    const updateName = (newName: string) => {
        setNameInStorage(newName);
        setName(newName);
    };

    return (
        <AuthContext.Provider value={{accessToken, refreshToken, name, userId, login, logout, updateName,clearAuth}}>
            {children}
        </AuthContext.Provider>
    )
};

export const useAuth=()=> {
    const context=useContext(AuthContext);
    if(!context) {
        throw new Error("AuthContext를 찾을 수 없습니다.")
    }
    return context;
}
