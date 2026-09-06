import PetForm from "@/components/form/PetForm";
import Header from "@/components/header/Header";
import { CheckCircleIcon, AlertCircleIcon } from "@/components/ui/icon";
import { useCustomToast } from "@/hooks/use-custom-toast";
import { ApiError, useCreatePetMutation } from "@/util/api";
import type { Pet } from "@/store/usePetStore";
import { useRouter } from "expo-router";
import { KeyboardAvoidingView, Platform, View } from "react-native";

const Create = () => {
  const router = useRouter();
  const { showToast } = useCustomToast();
  const { mutateAsync, isPending } = useCreatePetMutation();

  const handleSubmit = async (data: Partial<Pet>) => {
    try {
      await mutateAsync({
        request: {
          name: data.name,
          birth_year: data.birthYear?.trim() ? data.birthYear : null,
          breed_code: data.breedCode,
          is_neutered: data.isNeutered ?? false,
          gender: data.gender,
          color: data.color || null,
          weight: data.weight,
        },
        profileImageUri: data.profileImageUrl,
      });

      showToast({
        message: `${data.name} 등록이 완료됐어요!`,
        icon: CheckCircleIcon,
      });
      router.replace("/mypage/pets");
    } catch (error) {
      const message =
        error instanceof ApiError
          ? error.message || "반려견 등록에 실패했어요."
          : "반려견 등록에 실패했어요. 잠시 후 다시 시도해 주세요.";
      showToast({
        message,
        icon: AlertCircleIcon,
      });
    }
  };

  return (
    <View className="flex-1 bg-[#F7F7F7]">
      <Header title="반려견 추가" />

      <KeyboardAvoidingView
        className="flex-1"
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        keyboardVerticalOffset={8}
      >
        <PetForm onSubmit={handleSubmit} isSubmitting={isPending} />
      </KeyboardAvoidingView>
    </View>
  );
};

export default Create;
