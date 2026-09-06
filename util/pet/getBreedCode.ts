import { BREED_DATA } from "@/constants/breedData";

/**
 * 코드를 입력하면 견종명(한글)을 반환하는 유틸 함수
 */
export const getBreedName = (code: string | undefined): string => {
  if (!code) return "알 수 없음";
  const breed = BREED_DATA.find((item) => item.code === code);
  return breed ? breed.name : "알 수 없음";
};

/**
 * 코드를 입력하면 대표 색상(Hex)을 반환하는 유틸 함수 (초기 색상 세팅 시 유용)
 */
export const getBreedDefaultColor = (code: string | undefined): string => {
  if (!code) return "#FFFFFF";
  const breed = BREED_DATA.find((item) => item.code === code);
  return breed ? breed.color : "#FFFFFF";
};
