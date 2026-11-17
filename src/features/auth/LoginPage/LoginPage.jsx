"use client";

import Image from "next/image.js";
import Link from "next/link";
import { useState } from "react";

import { googleLogin } from "@/services/authService.js";
import { validateLogin } from "@/utils/validators.js";

import { Logo } from "@/components/common/Logo";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { AlertModal } from "@/components/ui/Modal/";
import { PasswordInput } from "@/components/ui/PasswordInput";

import { useLogin } from "../hooks/useLogin.js";
import { useSocialLoginError } from "../hooks/useSocialLoginError.js";
import { parseAuthError } from "../utils/parseAuthError.js";

import * as styles from "./LoginPage.css.js";

export default function LoginPage() {
  const { mutate, isPending, isSuccess } = useLogin();
  const isBusy = isPending || isSuccess;
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fieldError, setFieldError] = useState({});
  const socialErrorMessage = useSocialLoginError();
  const [loginError, setLoginError] = useState(socialErrorMessage);

  const handleSubmit = (event) => {
    event.preventDefault();

    const errors = validateLogin({ email, password });
    setFieldError(errors);

    if (Object.keys(errors).length !== 0) {
      return;
    }

    mutate(
      { email, password },
      {
        onError: (error) => {
          const result = parseAuthError(error);
          if (result.fieldErrors) {
            setFieldError(result.fieldErrors);
          } else {
            setLoginError(result.message);
          }
        },
      },
    );
  };

  return (
    <>
      <form className={styles.container} onSubmit={handleSubmit}>
        <div className={styles.loginContainer}>
          <Logo className={styles.logoSize} />
          <div className={styles.formContainer}>
            <Input
              error={fieldError.email}
              label="이메일"
              placeholder="이메일을 입력해주세요"
              value={email}
              onChange={(event) => {
                setEmail(event.target.value);
                setFieldError((prev) => ({ ...prev, email: "" }));
                // 에러 후 다시 입력하면 에러문구 없어짐
              }}
            />
            <PasswordInput
              error={fieldError.password}
              label="비밀번호"
              placeholder="비밀번호를 입력해주세요"
              value={password}
              onChange={(event) => {
                setPassword(event.target.value);
                setFieldError((prev) => ({ ...prev, password: "" }));
              }}
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
