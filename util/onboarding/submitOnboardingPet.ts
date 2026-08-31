import type {
  OnboardingAllergy,
  OnboardingVaccine,
} from "@/store/useOnboardingStore";
import { createAllergy, toAllergyRequest } from "@/util/api/allergies/api";
import {
  createPet,
  getCreatedPetId,
  getPetList,
  uploadPetProfile,
  type MappedPetList,
} from "@/util/api/pets/api";
import {
  createVaccination,
  toVaccinationRequest,
} from "@/util/api/vaccines/api";

export type OnboardingPetPayload = {
  name: string;
  profileImage: string;
  gender: "F" | "M";
  birthDate: string | null;
  breedCode: string;
  color: string;
  isNeutered: boolean;
  weight: string;
  allergies: OnboardingAllergy[];
  vaccines: OnboardingVaccine[];
};

export type SubmitOnboardingPetResult = {
  petId: string;
  list: MappedPetList;
};

/** 온보딩 입력값으로 반려견·알러지·접종을 API에 등록 */
export const submitOnboardingPet = async (
  payload: OnboardingPetPayload,
): Promise<SubmitOnboardingPetResult> => {
  const weightNum = Number(payload.weight);

  if (
    !payload.name.trim() ||
    !payload.gender ||
    !payload.breedCode ||
    !weightNum ||
    Number.isNaN(weightNum)
  ) {
    throw new Error("필수 정보가 누락되었습니다.");
  }

  const created = await createPet({
    name: payload.name.trim(),
    birth_year: payload.birthDate || null,
    breed_code: payload.breedCode,
    is_neutered: payload.isNeutered,
    gender: payload.gender,
    color: payload.color || null,
    weight: weightNum,
  });

  const petId = getCreatedPetId(created);
  if (!petId) {
    throw new Error("등록 응답에 pet_id가 없습니다.");
  }

  if (payload.profileImage) {
    await uploadPetProfile(petId, { uri: payload.profileImage });
  }

  for (const allergy of payload.allergies) {
    await createAllergy(
      petId,
      toAllergyRequest({
        allergen: allergy.allergen,
        severity: allergy.severity,
        isActive: true,
      }),
    );
  }

  for (const vaccine of payload.vaccines) {
    await createVaccination(
      petId,
      toVaccinationRequest({
        name: vaccine.name,
        vaccinatedAt: vaccine.vaccinatedAt,
        nextVaccinationAt: vaccine.nextVaccinationAt,
        memo: vaccine.memo,
      }),
    );
  }

  const list = await getPetList();
  return { petId, list };
};
