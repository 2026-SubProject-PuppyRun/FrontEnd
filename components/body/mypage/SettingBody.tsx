import WarningAlert from "@/components/modal/WarningAlert";
import ChangeNameSheet from "@/components/sheet/ChangeNameSheet";
import AlarmSetSwitch from "@/components/switch/AlarmSetSwitch";
import {
  Accordion,
  AccordionContent,
  AccordionContentText,
  AccordionHeader,
  AccordionIcon,
  AccordionItem,
  AccordionTitleText,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Divider } from "@/components/ui/divider";
import {
  ChevronDownIcon,
  ChevronUpIcon,
  CloseIcon,
} from "@/components/ui/icon";
import { Pressable } from "@/components/ui/pressable";
import { useCustomToast } from "@/hooks/use-custom-toast";
import { useEffect, useState } from "react";
import { View } from "react-native";

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
    // TODO: 서버에서 알림 설정 상태를 가져와서 상태 업데이트
    const fetchAlarmSettings = async () => {
      setIsFirstAlarmEnabled(false); // 예시: 첫 번째 알림은 비활성화
      setIsSecondAlarmEnabled(true); // 예시: 두 번째 알림은 활성화
    };
    fetchAlarmSettings();
  }, []);

  const handleAllAlarmToggle = async () => {
    const newValue = !isFirstAlarmEnabled || !isSecondAlarmEnabled;

    setIsFirstAlarmEnabled(newValue);
    setIsSecondAlarmEnabled(newValue);
    try {
      await new Promise((resolve) => setTimeout(resolve, 500)); // ToDO: 서버에 알림 설정 변경 요청 보내기
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
      await new Promise((resolve) => setTimeout(resolve, 500)); // ToDO: 서버에 알림 설정 변경 요청 보내기
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
      await new Promise((resolve) => setTimeout(resolve, 500)); // ToDO: 서버에 알림 설정 변경 요청 보내기
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
      await new Promise((resolve) => setTimeout(resolve, 500)); // ToDO: 서버에 로그아웃 요청 보내기
      toast.showToast({
        message: "로그아웃 되었습니다.",
      });
      //TODO: 로그아웃 후 처리 (예: 로그인 화면으로 이동)
    } catch (error) {
      toast.showToast({
        message: "로그아웃에 실패했습니다. 다시 시도해주세요.",
        icon: CloseIcon,
      });
    }
  };

  const handleWithdrawal = async () => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 500)); // ToDO: 서버에 회원 탈퇴 요청 보내기
      toast.showToast({
        message: "회원 탈퇴 되었습니다.",
      });
      //TODO: 회원 탈퇴 후 처리 (예: 회원 가입 화면으로 이동)
    } catch (error) {
      toast.showToast({
        message: "회원 탈퇴에 실패했습니다. 다시 시도해주세요.",
        icon: CloseIcon,
      });
    }
  };

  const handleLogoutAlertOpen = () => setShowLogoutAlert(true);
  const handleLogoutAlertClose = () => setShowLogoutAlert(false);
  const handleWithdrawalAlertOpen = () => setShowWithdrawalAlert(true);
  const handleWithdrawalAlertClose = () => setShowWithdrawalAlert(false);
  return (
    <>
      <View className=" m-4 flex-1 rounded-lg bg-gray-200 p-4">
        <Accordion
          size="lg"
          variant="unfilled"
          type="multiple"
          isCollapsible={true}
          isDisabled={false}
          className="m-5 w-[90%] gap-2"
        >
          <AccordionItem value="a">
            <AccordionHeader>
              <AccordionTrigger>
                {({ isExpanded }: { isExpanded: boolean }) => {
                  return (
                    <>
                      <AccordionTitleText className="text-black">
                        알림 설정
                      </AccordionTitleText>
                      {isExpanded ? (
                        <AccordionIcon
                          as={ChevronUpIcon}
                          className="ml-3 text-black"
                        />
                      ) : (
                        <AccordionIcon
                          as={ChevronDownIcon}
                          className="ml-3 text-black"
                        />
                      )}
                    </>
                  );
                }}
              </AccordionTrigger>
            </AccordionHeader>
            <AccordionContent className=" gap-2">
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
          <Divider />
          <AccordionItem value="b">
            <AccordionHeader>
              <AccordionTrigger>
                {({ isExpanded }: { isExpanded: boolean }) => {
                  return (
                    <>
                      <AccordionTitleText className=" text-black">
                        개인정보 설정
                      </AccordionTitleText>
                      {isExpanded ? (
                        <AccordionIcon
                          as={ChevronUpIcon}
                          className="ml-3 text-black"
                        />
                      ) : (
                        <AccordionIcon
                          as={ChevronDownIcon}
                          className="ml-3 text-black"
                        />
                      )}
                    </>
                  );
                }}
              </AccordionTrigger>
            </AccordionHeader>
            <AccordionContent className="gap-2">
              <Pressable
                onPress={() => {
                  setShowActionsheet(true);
                }}
              >
                <AccordionContentText className=" text-black">
                  닉네임 변경
                </AccordionContentText>
              </Pressable>

              <Pressable
                onPress={() => {
                  handleLogoutAlertOpen();
                }}
              >
                <AccordionContentText className=" text-black">
                  로그아웃
                </AccordionContentText>
              </Pressable>
              <Pressable
                onPress={() => {
                  handleWithdrawalAlertOpen();
                }}
              >
                <AccordionContentText className=" text-black">
                  회원 탈퇴
                </AccordionContentText>
              </Pressable>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </View>
      <ChangeNameSheet
        showActionsheet={showActionsheet}
        setShowActionsheet={setShowActionsheet}
      />
      <WarningAlert
        showAlertDialog={showLogoutAlert}
        handleClose={handleLogoutAlertClose}
        title="로그아웃"
        description="정말 로그아웃 하시겠습니까?"
        confirmText="로그아웃"
        confirmAction={handleLogout}
      />
      <WarningAlert
        showAlertDialog={showWithdrawalAlert}
        handleClose={handleWithdrawalAlertClose}
        title="회원 탈퇴"
        description="정말 회원 탈퇴 하시겠습니까?"
        confirmText="회원 탈퇴"
        confirmAction={handleWithdrawal}
      />
    </>
  );
};

export default SettingBody;
