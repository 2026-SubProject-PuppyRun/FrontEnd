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
import { ChevronDownIcon, ChevronUpIcon } from "@/components/ui/icon";
import { Pressable } from "@/components/ui/pressable";
import { useEffect, useState } from "react";
import { View } from "react-native";

const SettingBody = () => {
  const [isFirstAlarmEnabled, setIsFirstAlarmEnabled] = useState(false);
  const [isSecondAlarmEnabled, setIsSecondAlarmEnabled] = useState(true);

  useEffect(() => {
    // TODO: 서버에서 알림 설정 상태를 가져와서 상태 업데이트
    const fetchAlarmSettings = async () => {
      setIsFirstAlarmEnabled(false); // 예시: 첫 번째 알림은 비활성화
      setIsSecondAlarmEnabled(true); // 예시: 두 번째 알림은 활성화
    };
  }, []);

  const handleAllAlarmToggle = () => {
    const newValue = !isFirstAlarmEnabled || !isSecondAlarmEnabled;
    setIsFirstAlarmEnabled(newValue);
    setIsSecondAlarmEnabled(newValue);
  };

  const handleFirstAlarmToggle = () => {
    setIsFirstAlarmEnabled((prev) => !prev);
  };

  const handleSecondAlarmToggle = () => {
    setIsSecondAlarmEnabled((prev) => !prev);
  };
  return (
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
                console.log("닉네임 변경 클릭");
              }}
            >
              <AccordionContentText className=" text-black">
                닉네임 변경
              </AccordionContentText>
            </Pressable>

            <Pressable
              onPress={() => {
                console.log("로그아웃 클릭");
              }}
            >
              <AccordionContentText className=" text-black">
                로그아웃
              </AccordionContentText>
            </Pressable>
            <Pressable
              onPress={() => {
                console.log("회원 탈퇴 클릭");
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
  );
};

export default SettingBody;
