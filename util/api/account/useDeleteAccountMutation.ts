import { logout } from "@/util/auth/logout";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteAccount } from "./api";

/**
 * 회원 탈퇴
 * DELETE /account
 */
export const useDeleteAccountMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteAccount,
    onSuccess: async () => {
      await logout();
      queryClient.clear();
    },
  });
};
