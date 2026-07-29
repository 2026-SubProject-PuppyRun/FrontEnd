import OnboardingScreen from "@/components/onboarding/OnboardingScreen";
import AllergyForm from "@/components/form/AllergyForm";
import VaccineForm from "@/components/form/VaccineForm";
import { useCustomToast } from "@/hooks/use-custom-toast";
import { useAllergyStore } from "@/store/useAllergyStore";
import { useOnboardingStore } from "@/store/useOnboardingStore";
import { usePetStore } from "@/store/usePetStore";
import { useVaccineStore } from "@/store/useVaccineStore";
import { AllergyFormValues } from "@/types/allergy";
import { VaccineFormValues } from "@/types/vaccine";
import {
  ALLERGY_CATEGORY_COLORS,
  getCategoryLabel,
  getSeverityLabel,
} from "@/util/allergy";
import { CheckCircleIcon } from "@/components/ui/icon";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  Modal,
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";

const Health = () => {
  const router = useRouter();
  const { showToast } = useCustomToast();
  const [allergyModalOpen, setAllergyModalOpen] = useState(false);
  const [vaccineModalOpen, setVaccineModalOpen] = useState(false);

  const name = useOnboardingStore((s) => s.name);
  const profileImage = useOnboardingStore((s) => s.profileImage);
  const gender = useOnboardingStore((s) => s.gender);
  const birthDate = useOnboardingStore((s) => s.birthDate);
  const breedCode = useOnboardingStore((s) => s.breedCode);
  const color = useOnboardingStore((s) => s.color);
  const isNeutered = useOnboardingStore((s) => s.isNeutered);
  const weight = useOnboardingStore((s) => s.weight);
  const allergies = useOnboardingStore((s) => s.allergies);
  const vaccines = useOnboardingStore((s) => s.vaccines);
  const addAllergy = useOnboardingStore((s) => s.addAllergy);
  const addVaccine = useOnboardingStore((s) => s.addVaccine);
  const removeAllergy = useOnboardingStore((s) => s.removeAllergy);
  const removeVaccine = useOnboardingStore((s) => s.removeVaccine);
  const reset = useOnboardingStore((s) => s.reset);

  const setPetList = usePetStore((s) => s.setPetList);
  const petList = usePetStore((s) => s.petList);
  const addAllergyRecord = useAllergyStore((s) => s.addRecord);
  const addVaccineRecord = useVaccineStore((s) => s.addRecord);

  const handleAddAllergy = (values: AllergyFormValues) => {
    addAllergy({
      category: values.category,
      allergen: values.allergen,
      severity: values.severity,
    });
    setAllergyModalOpen(false);
  };

  const handleAddVaccine = (values: VaccineFormValues) => {
    addVaccine({
      name: values.name,
      vaccinatedAt: values.vaccinatedAt,
      nextVaccinationAt: values.nextVaccinationAt,
    });
    setVaccineModalOpen(false);
  };

  const finishOnboarding = () => {
    const petId = `onboarding-${Date.now().toString(36)}`;
    const weightNum = Number(weight);

    const nextPet = {
      petId,
      name: name.trim(),
      profileImageUrl: profileImage || null,
      gender,
      birthYear: birthDate,
      breedCode,
      color,
      isNeutered,
      weight: weightNum,
      badgeCode: "",
    };

    setPetList([...(petList ?? []), nextPet]);

    allergies.forEach((item) => {
      addAllergyRecord({
        petId,
        category: item.category,
        allergen: item.allergen,
        severity: item.severity,
        isActive: true,
      });
    });

    vaccines.forEach((item) => {
      addVaccineRecord({
        petId,
        name: item.name,
        vaccinatedAt: item.vaccinatedAt,
        nextVaccinationAt: item.nextVaccinationAt,
      });
    });

    reset();
    showToast({
      message: `${name.trim()} 등록이 완료됐어요!`,
      icon: CheckCircleIcon,
    });
    router.replace("/(tabs)/home");
  };

  return (
    <>
      <OnboardingScreen
        step={3}
        title={"건강 정보도\n남길까요?"}
        subtitle="알러지와 접종 기록은 나중에 추가해도 괜찮아요"
        ctaLabel="완료하기"
        onCtaPress={finishOnboarding}
        secondaryLabel="나중에 입력하기"
        onSecondaryPress={finishOnboarding}
      >
        <View className="mb-4 rounded-3xl bg-white px-5 py-4">
          <View className="mb-3 flex-row items-center justify-between">
            <Text className="text-sm font-semibold text-gray-500">알러지</Text>
            <Pressable
              onPress={() => setAllergyModalOpen(true)}
              className="flex-row items-center gap-1 active:opacity-70"
            >
              <Ionicons name="add-circle" size={20} color="#F25857" />
              <Text className="text-sm font-semibold text-[#F25857]">추가</Text>
            </Pressable>
          </View>

          {allergies.length === 0 ? (
            <Text className="py-3 text-sm text-gray-400">
              등록된 알러지가 없습니다
            </Text>
          ) : (
            <View className="gap-2">
              {allergies.map((item) => {
                const colors = ALLERGY_CATEGORY_COLORS[item.category];
                return (
                  <View
                    key={item.id}
                    className="flex-row items-center gap-3 rounded-2xl bg-[#F7F7F7] px-3 py-3"
                  >
                    <View
                      className="rounded-full px-2.5 py-1"
                      style={{ backgroundColor: colors.bg }}
                    >
                      <Text
                        className="text-xs font-semibold"
                        style={{ color: colors.color }}
                      >
                        {getCategoryLabel(item.category)}
                      </Text>
                    </View>
                    <View className="flex-1">
                      <Text className="text-sm font-semibold text-[#0D0F1B]">
                        {item.allergen}
                      </Text>
                      {item.severity ? (
                        <Text className="mt-0.5 text-xs text-gray-500">
                          {getSeverityLabel(item.severity)}
                        </Text>
                      ) : null}
                    </View>
                    <Pressable
                      onPress={() => removeAllergy(item.id)}
                      hitSlop={8}
                      className="active:opacity-70"
                    >
                      <Ionicons name="close" size={18} color="#9CA3AF" />
                    </Pressable>
                  </View>
                );
              })}
            </View>
          )}
        </View>

        <View className="rounded-3xl bg-white px-5 py-4">
          <View className="mb-3 flex-row items-center justify-between">
            <Text className="text-sm font-semibold text-gray-500">접종</Text>
            <Pressable
              onPress={() => setVaccineModalOpen(true)}
              className="flex-row items-center gap-1 active:opacity-70"
            >
              <Ionicons name="add-circle" size={20} color="#F25857" />
              <Text className="text-sm font-semibold text-[#F25857]">추가</Text>
            </Pressable>
          </View>

          {vaccines.length === 0 ? (
            <Text className="py-3 text-sm text-gray-400">
              등록된 접종이 없습니다
            </Text>
          ) : (
            <View className="gap-2">
              {vaccines.map((item) => (
                <View
                  key={item.id}
                  className="flex-row items-center gap-3 rounded-2xl bg-[#F7F7F7] px-3 py-3"
                >
                  <View className="h-9 w-9 items-center justify-center rounded-full bg-[#FFF0EF]">
                    <Ionicons name="medkit" size={16} color="#F25857" />
                  </View>
                  <View className="flex-1">
                    <Text className="text-sm font-semibold text-[#0D0F1B]">
                      {item.name}
                    </Text>
                    <Text className="mt-0.5 text-xs text-gray-500">
                      {item.vaccinatedAt} · 다음 {item.nextVaccinationAt}
                    </Text>
                  </View>
                  <Pressable
                    onPress={() => removeVaccine(item.id)}
                    hitSlop={8}
                    className="active:opacity-70"
                  >
                    <Ionicons name="close" size={18} color="#9CA3AF" />
                  </Pressable>
                </View>
              ))}
            </View>
          )}
        </View>
      </OnboardingScreen>

      <Modal visible={allergyModalOpen} transparent animationType="slide">
        <View className="flex-1 justify-end bg-black/50">
          <View className="max-h-[88%] rounded-t-3xl bg-white">
            <View className="flex-row items-center justify-between border-b border-gray-100 px-5 py-4">
              <Text className="text-lg font-bold text-[#0D0F1B]">
                알러지 추가
              </Text>
              <Pressable
                onPress={() => setAllergyModalOpen(false)}
                hitSlop={8}
                className="active:opacity-70"
              >
                <Ionicons name="close" size={22} color="#0D0F1B" />
              </Pressable>
            </View>
            <ScrollView
              contentContainerStyle={{ padding: 20, paddingBottom: 32 }}
              keyboardShouldPersistTaps="handled"
            >
              <AllergyForm
                submitLabel="추가하기"
                onSubmit={handleAddAllergy}
                onDelete={() => setAllergyModalOpen(false)}
              />
            </ScrollView>
          </View>
        </View>
      </Modal>

      <Modal visible={vaccineModalOpen} transparent animationType="slide">
        <View className="flex-1 justify-end bg-black/50">
          <View className="max-h-[88%] rounded-t-3xl bg-white">
            <View className="flex-row items-center justify-between border-b border-gray-100 px-5 py-4">
              <Text className="text-lg font-bold text-[#0D0F1B]">접종 추가</Text>
              <Pressable
                onPress={() => setVaccineModalOpen(false)}
                hitSlop={8}
                className="active:opacity-70"
              >
                <Ionicons name="close" size={22} color="#0D0F1B" />
              </Pressable>
            </View>
            <ScrollView
              contentContainerStyle={{ padding: 20, paddingBottom: 32 }}
              keyboardShouldPersistTaps="handled"
            >
              <VaccineForm
                submitLabel="추가하기"
                onSubmit={handleAddVaccine}
                onDelete={() => setVaccineModalOpen(false)}
              />
            </ScrollView>
          </View>
        </View>
      </Modal>
    </>
  );
};

export default Health;
