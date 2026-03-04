import React from "react";
import {
  AlertDialog,
  AlertDialogBackdrop,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
} from "../ui/alert-dialog";
import { Button, ButtonText } from "../ui/button";
import { Heading } from "../ui/heading";
import { Text } from "../ui/text";
import { VStack } from "../ui/vstack";

interface CustomAlertProps {
  showAlertDialog: boolean;
  handleClose: () => void;
  title?: string; // 모달 제목
  description?: string; // 모달 설명
  onConfirm?: () => void; // 확인 버튼 눌렀을 때 실행할 함수
  confirmText?: string; // 확인 버튼 텍스트 (기본값: "확인")
  cancelText?: string; // 취소 버튼 텍스트 (기본값: "취소")
  children?: React.ReactNode; // 완전히 커스텀한 내부 UI가 필요할 때 사용
}

const CustomAlert = ({
  showAlertDialog,
  handleClose,
  title,
  description,
  onConfirm,
  confirmText = "확인",
  cancelText = "취소",
  children,
}: CustomAlertProps) => {
  return (
    <AlertDialog isOpen={showAlertDialog} onClose={handleClose}>
      <AlertDialogBackdrop />
      <AlertDialogContent className="mx-2 w-10/12 max-w-[649px] gap-4 bg-primary-700 p-4 md:flex-row">
        <AlertDialogBody
          className=""
          contentContainerClassName="flex-row gap-4"
        >
          {children ? (
            children 
          ) : (
            <VStack className="gap-1">
              {title && (
                <Heading
                  size="md"
                  className="font-semibold text-typography-950"
                >
                  {title}
                </Heading>
              )}
              {description && <Text size="sm">{description}</Text>}
            </VStack>
          )}
        </AlertDialogBody>
        <AlertDialogFooter>
          <Button
            variant="outline"
            action="secondary"
            onPress={handleClose}
            size="sm"
          >
            <ButtonText>{cancelText}</ButtonText>
          </Button>
          <Button
            size="sm"
            onPress={() => {
              if (onConfirm) onConfirm();
              handleClose();
            }}
          >
            <ButtonText>{confirmText}</ButtonText>
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default CustomAlert;
