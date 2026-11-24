"use client";

import Image from "next/image.js";
import Link from "next/link";
import { useState } from "react";

import { useForm } from "react-hook-form";

import { googleLogin } from "@/services/authService.js";
import {
  emailValidator,
  nicknameValidator,
  passwordConfirmValidator,
  passwordValidator,
} from "@/utils/validators.js";

import { Logo } from "@/components/common/Logo";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { AlertModal } from "@/components/ui/Modal/index.js";
import { PasswordInput } from "@/components/ui/PasswordInput";

import { useSignup } from "../hooks/useSignup.js";
import { parseAuthError } from "../utils/parseAuthError.js";

import * as styles from "./SignupPage.css.js";

const DEFAULT_VALUES = {
  email: "",
  nickname: "",
  password: "",
  passwordConfirm: "",
};

export default function SignupPage() {
  const { mutate: signupMutate, isPending, isSuccess } = useSignup();
  const isBusy = isPending || isSuccess;
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm({ defaultValues: DEFAULT_VALUES });
  const [signupError, setSignupError] = useState("");

  const onSubmit = (data) => {
    //서버와 통신 전에 입력값 검증을 미리 해서 errors 객체에 값이 있으면 서버로 요청을 보내지 않고
    //화면(FE)에서 바로 에러를 띄운다

    //FE에서 로그인 시 버튼이 비활성화되지만 키보드 접근 등이 가능하므로
    //코드 차원에서 막아주는 방어코드가 필요 isBusy(대기 또는 성공)일 때 클릭되면 그냥 return
    if (isBusy) {
      return;
    }

    signupMutate(data, {
      onError: (error) => {
        const { fieldErrors, message } = parseAuthError(error);
        if (!fieldErrors) {
          setSignupError(message);
          return;
        }
        Object.entries(fieldErrors)
          .filter(([name]) => Object.hasOwn(DEFAULT_VALUES, name))
          .forEach(([name, msg]) => {
            setError(name, { type: "server", message: msg });
          });
      },
    });
  };

  return (
    <>
      <form className={styles.container} onSubmit={handleSubmit(onSubmit)}>
        <div className={styles.signupContainer}>
          <Logo className={styles.logoSize} />
          <div className={styles.formContainer}>
            <Input
              disabled={isBusy}
              error={errors.email?.message}
              label="이메일"
              placeholder="이메일을 입력해주세요"
              {...register("email", { validate: emailValidator })}
            />
            <Input
              disabled={isBusy}
              error={errors.nickname?.message}
              label="닉네임"
              placeholder="닉네임을 입력해주세요"
              {...register("nickname", { validate: nicknameValidator })}
            />
            <PasswordInput
              disabled={isBusy}
              error={errors.password?.message}
              label="비밀번호"
              placeholder="8자 이상 입력해주세요"
              {...register("password", { validate: passwordValidator, deps: "passwordConfirm" })}
            />
            <PasswordInput
              disabled={isBusy}
              error={errors.passwordConfirm?.message}
              label="비밀번호 확인"
              placeholder="비밀번호를 한번 더 입력해주세요"
              {...register("passwordConfirm", {
                validate: (value, formValues) =>
                  passwordConfirmValidator({
                    password: formValues.password,
                    passwordConfirm: value,
                  }),
              })}
            />
          </div>
          <div className={styles.buttonContainer}>
            <Button
              disabled={isBusy}
              fullWidth
              thickness="thin"
              type="submit"
              className={styles.buttonText}
            >
              {isBusy ? (
                <span role="status">
                  <span aria-hidden="true" className={styles.spinner} />
                  <span className={styles.srOnly}>회원가입 중</span>
                </span>
              ) : (
                "가입하기"
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
          <div className={styles.navLogin}>
            <div className={styles.text}>이미 최애의포토 회원이신가요?</div>
            <Link href="/login" className={styles.link}>
              로그인하기
            </Link>
          </div>
        </div>
      </form>
      <AlertModal
        description={signupError}
        isOpen={Boolean(signupError)}
        title="회원가입 실패"
        onClose={() => setSignupError("")}
      />
    </>
  );
}
