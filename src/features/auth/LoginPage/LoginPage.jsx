"use client";

import Image from "next/image.js";
import Link from "next/link";
import { useState } from "react";

import { useForm } from "react-hook-form";

import { googleLogin } from "@/services/authService.js";
import { emailValidator, passwordValidator } from "@/utils/validators.js";

import { Logo } from "@/components/common/Logo";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { AlertModal } from "@/components/ui/Modal/";
import { PasswordInput } from "@/components/ui/PasswordInput";

import { useLogin } from "../hooks/useLogin.js";
import { useSocialLoginError } from "../hooks/useSocialLoginError.js";
import { parseAuthError } from "../utils/parseAuthError.js";

import * as styles from "./LoginPage.css.js";

const DEFAULT_VALUES = {
  email: "",
  password: "",
};

export default function LoginPage() {
  const { mutate: loginMutate, isPending, isSuccess } = useLogin();
  const isBusy = isPending || isSuccess;
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
    //useForm에 formState라는 객체가 있고 거기에 errors라는 변수를 꺼낸다.
    //FE validator 결과와 setError로 넣은 서버 에러가 { type, message } 형태로 칸 이름별로 담긴다"
  } = useForm({
    defaultValues: DEFAULT_VALUES,
  });
  const socialErrorMessage = useSocialLoginError();
  const [loginError, setLoginError] = useState(socialErrorMessage);

  const onSubmit = (data) => {
    loginMutate(data, {
      onError: (error) => {
        const { fieldErrors, message } = parseAuthError(error);
        if (!fieldErrors) {
          setLoginError(message);
          return;
        }
        //Object.entries(obj) 는 객체를 [[객체키, 객체값]] 형태로 바꿔준다
        Object.entries(fieldErrors)
          .filter(([name]) => Object.hasOwn(DEFAULT_VALUES, name)) //fieldErrors 배열 안에 name만 꺼내서 필터링한다.
          .forEach(([name, msg]) => {
            //여기서 forEach()의 콜백함수 인자에 [name, message]를 넣은 건 위의 배열 형태를 구조분해하여 name, message 변수에 담는다는 의미다
            setError(name, {
              type: "server",
              message: Array.isArray(msg) ? msg[0] : msg,
            });
          });
      },
    });
  };

  return (
    <>
      {/* form 태그 안의 handleSubmit은 RHF 의 내장함수 이다. 
      handleSubmit이 input에 입력한 값을 모아서 data로 만들고 감싼 함수에 전달한다*/}
      <form className={styles.container} onSubmit={handleSubmit(onSubmit)}>
        <div className={styles.loginContainer}>
          <Logo className={styles.logoSize} />
          <div className={styles.formContainer}>
            <Input
              error={errors.email?.message}
              label="이메일"
              placeholder="이메일을 입력해주세요"
              {...register("email", { validate: emailValidator })}
              // -> RHF의 register 함수 반환값은 {name, onChange, onBlur, ref}다.
              //... 스프레드로 이를 펼치고 ref로 어떤 input인지 기억하고 필요할 떄 input.value를 읽는다.
              //따라서 입력값을 저장하는 setEmail 변수와 onChange를 한번에 처리할 수 있다.
              //입력 값 검증은 input 태그의 register에서 선언하고 실행은 useForm이 한다.
            />
            <PasswordInput
              error={errors.password?.message}
              label="비밀번호"
              placeholder="비밀번호를 입력해주세요"
              {...register("password", { validate: passwordValidator })}
            />
          </div>
          <div className={styles.buttonContainer}>
            <Button
              disabled={isBusy}
              fullWidth
              thickness="thin"
              type="submit"
              className={styles.loginBtn}
            >
              {isBusy ? (
                <span role="status">
                  <span aria-hidden="true" className={styles.spinner} />
                  <span className={styles.srOnly}>로그인 중</span>
                </span>
              ) : (
                "로그인"
              )}
            </Button>
            <Button
              disabled={isBusy}
              fullWidth
              thickness="thin"
              type="button"
              className={styles.googleBtn}
              onClick={() => googleLogin()}
            >
              <span className={styles.googleBtnText}>
                <Image alt="구글 로고" height={22} src="/images/google-logo.svg" width={22} />
                <span>Google로 시작하기</span>
              </span>
            </Button>
          </div>
          <div className={styles.navRegister}>
            <div className={styles.text}>최애의 포토가 처음이신가요?</div>
            <Link href="/signup" className={styles.link}>
              회원가입하기
            </Link>
          </div>
        </div>
      </form>
      {/* 랜덤 포인트 모달 등 커스텀 화면을 만들 때 사용하세요. */}
      <AlertModal
        description={loginError}
        isOpen={Boolean(loginError)}
        title="로그인 실패"
        onClose={() => {
          setLoginError("");
        }}
      />
    </>
  );
}
