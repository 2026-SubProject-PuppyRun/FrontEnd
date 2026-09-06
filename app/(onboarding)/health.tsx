import OnboardingScreen from "@/components/onboarding/OnboardingScreen";
import AllergyForm from "@/components/form/AllergyForm";
import VaccineForm from "@/components/form/VaccineForm";
import { useOnboardingStore } from "@/store/useOnboardingStore";
import { AllergyFormValues } from "@/types/allergy";
import { VaccineFormValues } from "@/types/vaccine";
import { getSeverityLabel } from "@/util/allergy";
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
  const [allergyModalOpen, setAllergyModalOpen] = useState(false);
  const [vaccineModalOpen, setVaccineModalOpen] = useState(false);

  const allergies = useOnboardingStore((s) => s.allergies);
  const vaccines = useOnboardingStore((s) => s.vaccines);
  const addAllergy = useOnboardingStore((s) => s.addAllergy);
  const addVaccine = useOnboardingStore((s) => s.addVaccine);
  const removeAllergy = useOnboardingStore((s) => s.removeAllergy);
  const removeVaccine = useOnboardingStore((s) => s.removeVaccine);

  const handleAddAllergy = (values: AllergyFormValues) => {
    addAllergy({
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
      memo: values.memo,
    });
    setVaccineModalOpen(false);
  };

  const goToTerms = () => {
    router.push("/(onboarding)/terms");
  };

  return (
    <>
      <OnboardingScreen
        step={3}
        title={"건강 정보도\n남길까요?"}
        subtitle="알러지와 접종 기록은 나중에 추가해도 괜찮아요"
        ctaLabel="다음"
        onCtaPress={goToTerms}
        secondaryLabel="나중에 입력하기"
        onSecondaryPress={goToTerms}
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
              {allergies.map((item) => (
                <View
                  key={item.id}
                  className="flex-row items-center gap-3 rounded-2xl bg-[#F7F7F7] px-3 py-3"
                >
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
              ))}
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
                    {item.memo ? (
                      <Text className="mt-0.5 text-xs text-gray-400">
                        {item.memo}
                      </Text>
                    ) : null}
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
