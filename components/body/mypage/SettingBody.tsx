import WarningAlert from "@/components/modal/WarningAlert";
import ChangeNameSheet from "@/components/sheet/ChangeNameSheet";
import AlarmSetSwitch from "@/components/switch/AlarmSetSwitch";
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
import { Ionicons } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import { ScrollView, View } from "react-native";

const SettingBody = () => {
  const [isFirstAlarmEnabled, setIsFirstAlarmEnabled] =
    useState<boolean>(false);
  const [isSecondAlarmEnabled, setIsSecondAlarmEnabled] =
    useState<boolean>(false);
  const toast = useCustomToast();
  const [showActionsheet, setShowActionsheet] = useState(false);
  const [showLogoutAlert, setShowLogoutAlert] = useState(false);
  const [showWithdrawalAlert, setShowWithdrawalAlert] = useState(false);

  useEffect(() => {
    const fetchAlarmSettings = async () => {
      setIsFirstAlarmEnabled(false);
      setIsSecondAlarmEnabled(true);
    };
    fetchAlarmSettings();
  }, []);

  const handleAllAlarmToggle = async () => {
    const newValue = !isFirstAlarmEnabled || !isSecondAlarmEnabled;

    setIsFirstAlarmEnabled(newValue);
    setIsSecondAlarmEnabled(newValue);
    try {
      await new Promise((resolve) => setTimeout(resolve, 500));
      toast.showToast({
        message: "알림 설정이 변경되었습니다.",
      });
    } catch (error) {
      setIsFirstAlarmEnabled(!newValue);
      setIsSecondAlarmEnabled(!newValue);
      toast.showToast({
        message: "알림 설정 변경에 실패했습니다. 다시 시도해주세요.",
        icon: CloseIcon,
      });
    }
  };

  const handleFirstAlarmToggle = async () => {
    setIsFirstAlarmEnabled((prev) => !prev);
    try {
      await new Promise((resolve) => setTimeout(resolve, 500));
      toast.showToast({
        message: "알림 설정이 변경되었습니다.",
      });
    } catch (error) {
      setIsFirstAlarmEnabled((prev) => !prev);
      toast.showToast({
        message: "알림 설정 변경에 실패했습니다. 다시 시도해주세요.",
        icon: CloseIcon,
      });
    }
  };

  const handleSecondAlarmToggle = async () => {
    setIsSecondAlarmEnabled((prev) => !prev);
    try {
      await new Promise((resolve) => setTimeout(resolve, 500));
      toast.showToast({
        message: "알림 설정이 변경되었습니다.",
      });
    } catch (error) {
      setIsSecondAlarmEnabled((prev) => !prev);
      toast.showToast({
        message: "알림 설정 변경에 실패했습니다. 다시 시도해주세요.",
        icon: CloseIcon,
      });
    }
  };

  const handleLogout = async () => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 500));
      toast.showToast({
        message: "로그아웃 되었습니다.",
      });
    } catch (error) {
      toast.showToast({
        message: "로그아웃에 실패했습니다. 다시 시도해주세요.",
        icon: CloseIcon,
      });
    }
  };

  const handleWithdrawal = async () => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 500));
      toast.showToast({
        message: "회원 탈퇴 되었습니다.",
      });
    } catch (error) {
      toast.showToast({
        message: "회원 탈퇴에 실패했습니다. 다시 시도해주세요.",
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
                <AlarmSetSwitch
                  alarmName="전체 알림 설정"
                  isEnabled={isFirstAlarmEnabled && isSecondAlarmEnabled}
                  onToggle={handleAllAlarmToggle}
                />
                <AlarmSetSwitch
                  alarmName="알람 1"
                  isEnabled={isFirstAlarmEnabled}
                  onToggle={handleFirstAlarmToggle}
                />
                <AlarmSetSwitch
                  alarmName="알람 2"
                  isEnabled={isSecondAlarmEnabled}
                  onToggle={handleSecondAlarmToggle}
                />
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
        handleClose={() => setShowWithdrawalAlert(false)}
        title="회원 탈퇴"
        description="정말 회원 탈퇴 하시겠습니까?"
        confirmText="회원 탈퇴"
        confirmAction={handleWithdrawal}
      />
    </>
  );
};

export default SettingBody;
