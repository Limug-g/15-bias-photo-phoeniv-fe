import { useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";

const SOCIAL_ERROR_MESSAGES = {
  INVALID_SOCIAL_AUTH_STATE: "유효하지 않거나 만료된 소셜 로그인 요청입니다.",
  SOCIAL_ACCOUNT_LINK_REQUIRED:
    "구글 계정과 동일한 계정으로 가입되어있습니다.\n일반 로그인으로 진행하세요.",
  SOCIAL_AUTH_FAILED: "구글 로그인에 실패했습니다. 다시 시도해 주세요.",
};

export function useSocialLoginError() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const socialError = searchParams.get("error");
  //get()에 들어가는 error는 url에 'error= ~ ' 하고 뒤에 붙는 쿼리다

  useEffect(() => {
    if (socialError) {
      router.replace("/login");
    }
  }, [socialError, router]);

  if (!socialError) {
    return ""; //-> /login 경로로 이동하면 쿼리에 error 가 없으므로 socialError = '' 공백을 리턴
  }
  return SOCIAL_ERROR_MESSAGES[socialError] ?? "구글 로그인에 실패했습니다. 다시 시도해 주세요.";
}
