import { useUserStore } from "@/store/useUserStore";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "../core/queryKeys";
import { changeNickname } from "./api";

/**
 * 닉네임 변경
 * POST /account/change/nickname
 */
export const useChangeNicknameMutation = () => {
  const queryClient = useQueryClient();
  const setNickName = useUserStore((state) => state.setNickName);

  return useMutation({
    mutationFn: (nickName: string) => changeNickname(nickName),
    onSuccess: async (nickName) => {
      setNickName(nickName);
      queryClient.setQueryData(queryKeys.account.me(), { nickName });
      await queryClient.invalidateQueries({
        queryKey: queryKeys.account.me(),
      });
    },
  });
};
