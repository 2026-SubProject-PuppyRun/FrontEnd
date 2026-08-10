import PetForm from "@/components/form/PetForm";
import Header from "@/components/header/Header";
import WarningAlert from "@/components/modal/WarningAlert";
import { AlertCircleIcon, CheckCircleIcon } from "@/components/ui/icon";
import { useCustomToast } from "@/hooks/use-custom-toast";
import type { Pet } from "@/store/usePetStore";
import { usePetStore } from "@/store/usePetStore";
import {
  ApiError,
  useDeletePetMutation,
  useUpdatePetMutation,
} from "@/util/api";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useState } from "react";
import { KeyboardAvoidingView, Platform, Text, View } from "react-native";

const resolveParam = (value: string | string[] | undefined) =>
  Array.isArray(value) ? value[0] : value;

const Edit = () => {
  const { id } = useLocalSearchParams<{ id?: string | string[] }>();
  const petId = resolveParam(id);
  const router = useRouter();
  const { showToast } = useCustomToast();
  const { mutateAsync: updatePet, isPending: isUpdating } =
    useUpdatePetMutation();
  const { mutateAsync: removePet, isPending: isDeleting } =
    useDeletePetMutation();
  const [showDeleteAlert, setShowDeleteAlert] = useState(false);

  const pet = usePetStore((state) =>
    state.petList?.find((p) => p.petId === petId),
  ) as Pet | undefined;

  const handleSubmit = async (data: Partial<Pet>) => {
    if (
      !petId ||
      !data.name ||
      !data.gender ||
      data.weight == null ||
      !data.color
    ) {
      return;
    }

    try {
      await updatePet({
        petId,
        request: {
          name: data.name,
          birth_year: data.birthYear ? data.birthYear : null,
          weight: data.weight,
          is_neutered: data.isNeutered ?? false,
          gender: data.gender,
          color: data.color,
        },
        profileImageUri: data.profileImageUrl,
      });

      showToast({
        message: `${data.name} 정보가 수정됐어요!`,
        icon: CheckCircleIcon,
      });
      router.replace("/mypage/pets");
    } catch (error) {
      const message =
        error instanceof ApiError
          ? error.message || "반려견 수정에 실패했어요."
          : "반려견 수정에 실패했어요. 잠시 후 다시 시도해 주세요.";
      showToast({
        message,
        icon: AlertCircleIcon,
      });
    }
  };

  const handleDelete = async () => {
    if (!petId || isDeleting) return;

    try {
      await removePet(petId);
      showToast({
        message: `${pet?.name ?? "반려견"}을(를) 삭제했어요.`,
        icon: CheckCircleIcon,
      });
      router.replace("/mypage/pets");
    } catch (error) {
      const message =
        error instanceof ApiError
          ? error.message || "반려견 삭제에 실패했어요."
          : "반려견 삭제에 실패했어요. 잠시 후 다시 시도해 주세요.";
      showToast({
        message,
        icon: AlertCircleIcon,
      });
    }
  };

  if (!pet) {
    return (
      <View className="flex-1 bg-[#F7F7F7]">
        <Header title="반려견 정보 수정" />
        <View className="flex-1 items-center justify-center px-6">
          <Text className="text-sm text-gray-500">
            반려견 정보를 찾을 수 없어요.
          </Text>
        </View>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-[#F7F7F7]">
      <Header title="반려견 정보 수정" />

      <KeyboardAvoidingView
        className="flex-1"
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        keyboardVerticalOffset={8}
      >
        <PetForm
          initialData={pet}
          onSubmit={handleSubmit}
          isSubmitting={isUpdating}
          onDelete={() => setShowDeleteAlert(true)}
          isDeleting={isDeleting}
        />
      </KeyboardAvoidingView>

      <WarningAlert
        showAlertDialog={showDeleteAlert}
        handleClose={() => setShowDeleteAlert(false)}
        title="반려견을 삭제할까요?"
        description={`${pet.name}의 정보가 삭제되며 되돌릴 수 없어요.`}
        confirmText="삭제하기"
        confirmAction={() => {
          void handleDelete();
        }}
      />
    </View>
  );
};

export default Edit;
