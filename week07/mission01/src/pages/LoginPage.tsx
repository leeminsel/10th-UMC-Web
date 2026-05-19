import { useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import useForm from "../hooks/useForm"
import { validateSignin, type UserSignInformation } from "../utils/validate"
import { useNavigate } from "react-router-dom";
import {useMutation} from "@tanstack/react-query";
import { postSignin } from "../apis/auth";

export const LoginPage = () => {
    const {login, accessToken} = useAuth();
    const navigate = useNavigate();

    const {mutate:signin,isPending} = useMutation ({
        mutationFn:postSignin,
        onSuccess: (response) => {
            login(response.data);  //AuthContext의 login 호출
            alert("로그인 성공");
            navigate("/my");
        },
        onError: (error) => {
            console.error("로그인 실패", error);
            alert("로그인 실패");
        },
    })

    useEffect(()=> {
        if(accessToken) {
            navigate("/")
        }
    },[navigate, accessToken])

    const {values, errors, touched, getInputProps} = useForm<UserSignInformation>({
        initialValue:{
            email:"",
            password:"",
        },
        validate: validateSignin
    });

    const handleSubmit= () => {
        console.log('[로그인 요청]', { email: values.email });
        signin(values);
    }

    const handleGoogleLogin=()=> {
        window.location.href=import.meta.env.VITE_SERVER_API_URL +"/v1/auth/google/login";
    }

    const isDisabled= Object.values(errors || {}).some((error:string)=> error.length>0) ||
    Object.values(values).some((value:string) => value==="");

  return (
    <div className="flex flex-col items-center justify-center flex-1 gap-4">
        <div className="flex flex-col gap-3">
        <h2 className="text-2xl font-bold text-center text-[#1a1a2e]">로그인</h2>
        <input
        {...getInputProps("email")}
        name="email"
        className={`border border-[#ccc] w-[300px] p-[10px] focus:border-[#807bff] rounded-sm
            ${errors?.email && touched?.email ? "border-red-500 bg-red-200":"border-gray-300"}`}
        type={"email"}
        placeholder={"이메일"}
        />
        {errors?.email && touched?.email && (
            <div className="text-red-500 text-sm">{errors.email}</div>
        )}

        <input
        {...getInputProps("password")}
        className={`border border-[#ccc] w-[300px] p-[10px] focus:border-[#807bff] rounded-sm
             ${errors?.password && touched?.password ? "border-red-500 bg-red-200":"border-gray-300"}`}
        type={"password"}
        placeholder={"비밀번호"}
        />
         {errors?.password && touched?.password && (
            <div className="text-red-500 text-sm">{errors.password}</div>
        )}
        <button
        type='button'
        onClick={handleSubmit}
        disabled={isDisabled || isPending}
        className="w-full bg-[#dda5e3] text-white py-3 rounded-md text-lg font-medium hover:bg-[#b2dab1] transition-colors cursor-pointer disabled:bg-gray-300">
            로그인
        </button>
        <button type='button'
        onClick={handleGoogleLogin}
        className="w-full bg-blue-700 text-white py-3 rounded-md text-lg font-medium hover:bg-blue-500 transition-colors cursor-pointer ">
            <div className="flex items-center justify-center gap-4">
                <span>구글 로그인</span>
            </div>
        </button>
        </div>
    </div>
  )
}
