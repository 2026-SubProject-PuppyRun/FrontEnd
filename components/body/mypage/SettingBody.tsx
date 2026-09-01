import NotificationSettingsSection from "@/components/body/mypage/NotificationSettingsSection";
import WarningAlert from "@/components/modal/WarningAlert";
import ChangeNameSheet from "@/components/sheet/ChangeNameSheet";
import {
  Accordion,
  AccordionContent,
  AccordionHeader,
  AccordionItem,
  AccordionTitleText,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { CloseIcon } from "@/components/ui/icon";
import { Pressable } from "@/components/ui/pressable";
import { Text } from "@/components/ui/text";
import { useCustomToast } from "@/hooks/use-custom-toast";
import { ApiError, useDeleteAccountMutation } from "@/util/api";
import { logout } from "@/util/auth/logout";
import { Ionicons } from "@expo/vector-icons";
import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "expo-router";
import { useState } from "react";
import { ScrollView, View } from "react-native";

const SettingBody = () => {
  const toast = useCustomToast();
  const router = useRouter();
  const queryClient = useQueryClient();
  const [showActionsheet, setShowActionsheet] = useState(false);
  const [showLogoutAlert, setShowLogoutAlert] = useState(false);
  const [showWithdrawalAlert, setShowWithdrawalAlert] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const { mutateAsync: withdrawAccount, isPending: isWithdrawing } =
    useDeleteAccountMutation();

  const handleLogout = async () => {
    if (isLoggingOut) return;

    setIsLoggingOut(true);
    try {
      await logout();
      queryClient.clear();
      setShowLogoutAlert(false);
      toast.showToast({
        message: "로그아웃 되었습니다.",
      });
      router.replace("/");
    } catch (error) {
      console.error("로그아웃 실패:", error);
      toast.showToast({
        message: "로그아웃에 실패했습니다. 다시 시도해주세요.",
        icon: CloseIcon,
      });
    } finally {
      setIsLoggingOut(false);
    }
  };

  const handleWithdrawal = async () => {
    if (isWithdrawing) return;

    try {
      await withdrawAccount();
      setShowWithdrawalAlert(false);
      toast.showToast({
        message: "회원 탈퇴 되었습니다.",
      });
      router.replace("/");
    } catch (error) {
      console.error("회원 탈퇴 실패:", error);
      toast.showToast({
        message:
          error instanceof ApiError
            ? error.message || "회원 탈퇴에 실패했습니다. 다시 시도해주세요."
            : "회원 탈퇴에 실패했습니다. 다시 시도해주세요.",
        icon: CloseIcon,
      });
    }
  };

  return (
    <>
      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingHorizontal: 24, paddingBottom: 32 }}
        showsVerticalScrollIndicator={false}
      >
        <View className="mb-4 overflow-hidden rounded-3xl bg-white shadow-sm">
          <Accordion
            size="lg"
            variant="unfilled"
            type="multiple"
            isCollapsible={true}
            className="w-full"
          >
            <AccordionItem value="alarm">
              <AccordionHeader>
                <AccordionTrigger className="px-5 py-4">
                  {({ isExpanded }: { isExpanded: boolean }) => (
                    <>
                      <View className="mr-3 rounded-2xl bg-[#FFF0F0] p-2.5">
                        <Ionicons
                          name="notifications-outline"
                          size={18}
                          color="#F25857"
                        />
                      </View>
                      <AccordionTitleText className="flex-1 text-base font-semibold text-[#0D0F1B]">
                        알림 설정
                      </AccordionTitleText>
                      <Ionicons
                        name={isExpanded ? "chevron-up" : "chevron-down"}
                        size={18}
                        color="#9CA3AF"
                      />
                    </>
                  )}
                </AccordionTrigger>
              </AccordionHeader>
              <AccordionContent className="gap-3 px-5 pb-5">
                <NotificationSettingsSection />
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </View>

        <View className="mb-4 overflow-hidden rounded-3xl bg-white shadow-sm">
          <Accordion
            size="lg"
            variant="unfilled"
            type="multiple"
            isCollapsible={true}
            className="w-full"
          >
            <AccordionItem value="account">
              <AccordionHeader>
                <AccordionTrigger className="px-5 py-4">
                  {({ isExpanded }: { isExpanded: boolean }) => (
                    <>
                      <View className="mr-3 rounded-2xl bg-[#FFF0F0] p-2.5">
                        <Ionicons
                          name="person-outline"
                          size={18}
                          color="#F25857"
                        />
                      </View>
                      <AccordionTitleText className="flex-1 text-base font-semibold text-[#0D0F1B]">
                        개인정보 설정
                      </AccordionTitleText>
                      <Ionicons
                        name={isExpanded ? "chevron-up" : "chevron-down"}
                        size={18}
                        color="#9CA3AF"
                      />
                    </>
                  )}
                </AccordionTrigger>
              </AccordionHeader>
              <AccordionContent className="gap-2 px-5 pb-5">
                <Pressable
                  onPress={() => setShowActionsheet(true)}
                  className="flex-row items-center justify-between rounded-2xl bg-[#F7F7F7] px-4 py-3.5"
                  style={({ pressed }) =>
                    pressed ? { opacity: 0.85 } : undefined
                  }
                >
                  <Text className="text-sm font-medium text-[#0D0F1B]">
                    닉네임 변경
                  </Text>
                  <Ionicons name="chevron-forward" size={16} color="#9CA3AF" />
                </Pressable>

                <Pressable
                  onPress={() => setShowLogoutAlert(true)}
                  className="flex-row items-center justify-between rounded-2xl bg-[#F7F7F7] px-4 py-3.5"
                  style={({ pressed }) =>
                    pressed ? { opacity: 0.85 } : undefined
                  }
                >
                  <Text className="text-sm font-medium text-[#0D0F1B]">
                    로그아웃
                  </Text>
                  <Ionicons name="log-out-outline" size={18} color="#6B7280" />
                </Pressable>

                <Pressable
                  onPress={() => setShowWithdrawalAlert(true)}
                  disabled={isWithdrawing}
                  className="flex-row items-center justify-between rounded-2xl bg-[#FFF0F0] px-4 py-3.5"
                  style={({ pressed }) =>
                    pressed ? { opacity: 0.85 } : undefined
                  }
                >
                  <Text className="text-sm font-medium text-[#F25857]">
                    회원 탈퇴
                  </Text>
                  <Ionicons name="trash-outline" size={18} color="#F25857" />
                </Pressable>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </View>
      </ScrollView>

      <ChangeNameSheet
        showActionsheet={showActionsheet}
        setShowActionsheet={setShowActionsheet}
      />
      <WarningAlert
        showAlertDialog={showLogoutAlert}
        handleClose={() => setShowLogoutAlert(false)}
        title="로그아웃"
        description="정말 로그아웃 하시겠습니까?"
        confirmText="로그아웃"
        confirmAction={handleLogout}
      />
      <WarningAlert
        showAlertDialog={showWithdrawalAlert}
        handleClose={() => {
          if (isWithdrawing) return;
          setShowWithdrawalAlert(false);
        }}
        title="회원 탈퇴"
        description="정말 회원 탈퇴 하시겠습니까?"
        confirmText="회원 탈퇴"
        confirmAction={handleWithdrawal}
      />
    </>
  );
};

export default SettingBody;
