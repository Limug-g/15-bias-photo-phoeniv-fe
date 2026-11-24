//api가 던지는 error를 판단만 해주는 함수
//판단한 결과를 LoginPage에 전달하고 거기서 상태 변수에 넣어준다
//여기서 리턴해주는 값은 에러 종류와 에러메세지를 담은 객체 {key: value} 형태의 값이다.
const FIELD_ERROR_CODES = ["VALIDATION_FAILED", "EMAIL_DUPLICATE", "NICKNAME_DUPLICATE"];

export function parseAuthError(error) {
  const hasFieldErrors = Object.keys(error?.fieldErrors ?? {}).length > 0;

  if (FIELD_ERROR_CODES.includes(error?.code) && hasFieldErrors) {
    const fieldErrors = Object.fromEntries(
      Object.entries(error?.fieldErrors || {}).map(([name, msg]) => [name, [msg].flat()[0]]),
    );
    return { fieldErrors };
    //여기 안에 들어가는 error.fieldErrors는 apiFetch가 던지는 에러로서
    //미리 정해진 거임
  }
  return { message: error?.status ? error.message : "네트워크 오류가 발생했습니다." };
}
