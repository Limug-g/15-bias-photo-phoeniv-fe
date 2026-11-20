import { useRouter } from "next/navigation";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import { signup } from "@/services/authService";
import { userKeys } from "@/services/queryKeys";

export function useSignup() {
  const queryClient = useQueryClient();
  const router = useRouter();
  const { mutate, isPending, isSuccess } = useMutation({
    mutationFn: signup,
    onSuccess: async ({ user }) => {
      await queryClient.cancelQueries({ queryKey: userKeys.me() });
      queryClient.setQueryData(userKeys.me(), user); //user 데이터를 캐시에 담는 과정
      router.push("/marketplace"); //회원가입 요청 성공 후 이동
    },
  });

  return { mutate, isPending, isSuccess };
}
