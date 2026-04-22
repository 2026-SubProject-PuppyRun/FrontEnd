import {
  AlertDialog,
  AlertDialogBackdrop,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
} from "../ui/alert-dialog";
import { Button, ButtonText } from "../ui/button";
import { Heading } from "../ui/heading";
import { Text } from "../ui/text";
interface WarningAlertProps {
  showAlertDialog: boolean;
  handleClose: () => void;
  title: string;
  description: string;
  confirmText: string;
  confirmAction: () => void;
}

const WarningAlert = ({
  showAlertDialog,
  handleClose,
  title,
  description,
  confirmText,
  confirmAction,
}: WarningAlertProps) => {
  return (
    <>
      <AlertDialog isOpen={showAlertDialog} onClose={handleClose}>
        <AlertDialogBackdrop />
        <AlertDialogContent className="w-[90%] max-w-[415px] items-center gap-4">
          <AlertDialogHeader className="mb-2">
            <Heading size="md">{title}</Heading>
          </AlertDialogHeader>
          <AlertDialogBody>
            <Text size="sm" className="text-center">
              {description}
            </Text>
          </AlertDialogBody>
          <AlertDialogFooter className="mt-5">
            <Button
              size="sm"
              action="negative"
              onPress={() => {
                confirmAction();
                handleClose();
              }}
              className="px-[30px]"
            >
              <ButtonText>{confirmText}</ButtonText>
            </Button>
            <Button
              variant="outline"
              action="secondary"
              onPress={handleClose}
              size="sm"
              className="px-[30px]"
            >
              <ButtonText>취소하기</ButtonText>
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default WarningAlert;
