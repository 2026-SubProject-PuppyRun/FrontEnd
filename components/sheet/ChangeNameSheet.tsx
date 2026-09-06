import { useCustomToast } from "@/hooks/use-custom-toast";
import { useUserStore } from "@/store/useUserStore";
import { ApiError, useChangeNicknameMutation } from "@/util/api";
import { useEffect, useRef, useState } from "react";
import {
  Actionsheet,
  ActionsheetBackdrop,
  ActionsheetContent,
  ActionsheetDragIndicator,
  ActionsheetDragIndicatorWrapper,
} from "../ui/actionsheet";
import { Button, ButtonSpinner, ButtonText } from "../ui/button";
import {
  FormControl,
  FormControlLabel,
  FormControlLabelText,
} from "../ui/form-control";
import { AddIcon, CloseIcon } from "../ui/icon";
import { Input, InputField, InputIcon, InputSlot } from "../ui/input";
import { Text } from "../ui/text";
import { VStack } from "../ui/vstack";

interface ChangeNameSheetProps {
  showActionsheet: boolean;
  setShowActionsheet: (value: boolean) => void;
}

const NICKNAME_MIN = 2;
const NICKNAME_MAX = 20;

const ChangeNameSheet = ({
  showActionsheet,
  setShowActionsheet,
}: ChangeNameSheetProps) => {
  const toast = useCustomToast();
  const userName = useUserStore((state) => state.nickName) ?? "";
  const nicknameRef = useRef(userName);
  const [inputKey, setInputKey] = useState(0);
  const changeNicknameMutation = useChangeNicknameMutation();
  const isSubmitting = changeNicknameMutation.isPending;

  useEffect(() => {
    if (showActionsheet) {
      nicknameRef.current = userName;
      setInputKey((key) => key + 1);
    }
  }, [showActionsheet, userName]);

  const handleNicknameChange = async (nickname: string) => {
    if (isSubmitting) return;

    const trimmedNickname = nickname.trim();

    if (!trimmedNickname) {
      toast.showToast({
        message: "닉네임을 입력해주세요.",
        icon: CloseIcon,
        iconColor: "red",
      });
      return;
    }

    if (
      trimmedNickname.length < NICKNAME_MIN ||
      trimmedNickname.length > NICKNAME_MAX
    ) {
      toast.showToast({
        message: `닉네임은 ${NICKNAME_MIN}~${NICKNAME_MAX}자로 입력해주세요.`,
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
      await changeNicknameMutation.mutateAsync(trimmedNickname);
      toast.showToast({
        message: "닉네임이 변경되었습니다.",
      });
      setShowActionsheet(false);
    } catch (error) {
      const message =
        error instanceof ApiError
          ? error.message
          : "닉네임 변경에 실패했습니다. 다시 시도해주세요.";
      toast.showToast({
        message,
        icon: CloseIcon,
      });
    }
  };

  return (
    <>
      <Actionsheet
        isOpen={showActionsheet}
        onClose={() => {
          if (isSubmitting) return;
          setShowActionsheet(false);
        }}
        snapPoints={[36]}
      >
        <ActionsheetBackdrop />
        <ActionsheetContent className="bg-background-light">
          <ActionsheetDragIndicatorWrapper>
            <ActionsheetDragIndicator />
          </ActionsheetDragIndicatorWrapper>
          <VStack className="w-full flex-1 gap-2 pt-5">
            <FormControl className="mt-9 gap-2">
              <FormControlLabel>
                <FormControlLabelText className="text-gray-900">
                  새 닉네임 입력
                </FormControlLabelText>
              </FormControlLabel>
              <Input className="w-full rounded-2xl">
                <InputSlot>
                  <InputIcon as={AddIcon} className="ml-2 " />
                </InputSlot>
                <InputField
                  className="text-gray-900"
                  key={inputKey}
                  placeholder="새 닉네임 입력"
                  defaultValue={userName}
                  onChangeText={(text) => {
                    nicknameRef.current = text;
                  }}
                  editable={!isSubmitting}
                />
              </Input>
            </FormControl>
            <Text className="text-gray-500" size="sm">
              2~20자, 기존과 다른 닉네임으로 변경할 수 있어요.
            </Text>
            <Button
              onPress={() => handleNicknameChange(nicknameRef.current)}
              disabled={isSubmitting}
              className="mb-2 mt-auto w-full rounded-2xl bg-primary-500"
            >
              {isSubmitting ? <ButtonSpinner color="#FFFFFF" /> : null}
              <ButtonText>닉네임 변경</ButtonText>
            </Button>
          </VStack>
        </ActionsheetContent>
      </Actionsheet>
    </>
  );
};

export default ChangeNameSheet;
