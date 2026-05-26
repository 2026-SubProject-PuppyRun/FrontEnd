import { Pet } from "@/store/usePetStore";
import { getBreedName } from "@/util/getBreedCode";

export interface PetBasicInfo {
  name: string;
  birthLabel: string;
  breedName: string;
  genderLabel: string;
  neuteredLabel: string;
  weightLabel: string;
  color: string;
  profileImageUrl: string | null;
}

const formatBirth = (birthYear: string | null): string => {
  if (!birthYear) return "0000.00.00";
  const date = new Date(birthYear);
  if (Number.isNaN(date.getTime())) return birthYear;
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}.${m}.${d}`;
};

const formatGender = (gender?: Pet["gender"]): string => {
  if (gender === "M") return "남아";
  if (gender === "F") return "여아";
  return "-";
};

export const getPetBasicInfo = (pet: Pet): PetBasicInfo => ({
  name: pet.name,
  birthLabel: formatBirth(pet.birthYear),
  breedName: getBreedName(pet.breedCode),
  genderLabel: formatGender(pet.gender),
  neuteredLabel: pet.isNeutered ? "중성화" : "미중성화",
  weightLabel: `${pet.weight}kg`,
  color: pet.color,
  profileImageUrl: pet.profileImageUrl,
});
