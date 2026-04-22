import { useCustomToast } from "@/hooks/use-custom-toast";
import {
  Actionsheet,
  ActionsheetBackdrop,
  ActionsheetContent,
  ActionsheetDragIndicator,
  ActionsheetDragIndicatorWrapper,
} from "../ui/actionsheet";
import { Button, ButtonText } from "../ui/button";
import {
  FormControl,
  FormControlLabel,
  FormControlLabelText,
} from "../ui/form-control";
import { AddIcon, CloseIcon } from "../ui/icon";
import { Input, InputField, InputIcon, InputSlot } from "../ui/input";
import { Text } from "../ui/text";

import { useState } from "react";
import { VStack } from "../ui/vstack";

interface ChangeNameSheetProps {
  showActionsheet: boolean;
  setShowActionsheet: (value: boolean) => void;
}

const ChangeNameSheet = ({
  showActionsheet,
  setShowActionsheet,
}: ChangeNameSheetProps) => {
  const toast = useCustomToast();
  // TODO: 기존 닉네임은 스토어에서 가져오고 폼 예외처리 필요 (동일한 닉네임인지)
  const userName = "이채주";
  const [newNickname, setNewNickname] = useState(userName);
  const handleNicknameChange = async (newNickname: string) => {
    const trimmedNickname = newNickname.trim();

    if (!trimmedNickname) {
      toast.showToast({
        message: "닉네임을 입력해주세요.",
        icon: CloseIcon,
        iconColor: "red",
      });
      return;
    }

    if (trimmedNickname === userName) {
      toast.showToast({
        message: "기존과 동일한 닉네임은 사용할 수 없습니다.",
        icon: CloseIcon,
        iconColor: "red",
      });
      return;
    }

    try {
      await new Promise((resolve) => setTimeout(resolve, 500)); // ToDO: 서버에 닉네임 변경 요청 보내기
      toast.showToast({
        message: "닉네임이 변경되었습니다.",
      });
      setShowActionsheet(false);
    } catch (error) {
      toast.showToast({
        message: "닉네임 변경에 실패했습니다. 다시 시도해주세요.",
        icon: CloseIcon,
      });
    }
  };

  return (
    <>
      <Actionsheet
        isOpen={showActionsheet}
        onClose={() => setShowActionsheet(false)}
        snapPoints={[36]}
      >
        <ActionsheetBackdrop />
        <ActionsheetContent className="">
          <ActionsheetDragIndicatorWrapper>
            <ActionsheetDragIndicator />
          </ActionsheetDragIndicatorWrapper>
          <VStack className="w-full flex-1 gap-2 pt-5">
            <FormControl className="mt-9 gap-2">
              <FormControlLabel>
                <FormControlLabelText>새 닉네임 입력</FormControlLabelText>
              </FormControlLabel>
              <Input className="w-full rounded-2xl">
                <InputSlot>
                  <InputIcon as={AddIcon} className="ml-2 " />
                </InputSlot>
                <InputField
                  placeholder="새 닉네임 입력"
                  value={newNickname}
                  onChangeText={setNewNickname}
                />
              </Input>
            </FormControl>
            <Text className="text-gray-500" size="sm">
              기존과 동일한 닉네임은 사용할 수 없습니다.
            </Text>
            <Button
              onPress={() => handleNicknameChange(newNickname)}
              className="mb-2 mt-auto w-full rounded-2xl bg-primary-500"
            >
              <ButtonText>닉네임 변경</ButtonText>
            </Button>
          </VStack>
        </ActionsheetContent>
      </Actionsheet>
    </>
  );
};

export default ChangeNameSheet;
