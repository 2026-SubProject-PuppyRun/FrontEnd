export interface BreedOption {
  label: string; // 견종명 (한글)
  value: string; // 코드 (String)
  color: string; // 대표 색상 (기본값 설정용)
}

export const BREED_LIST: BreedOption[] = [
  // 소형견
  { label: "말티즈", value: "101", color: "#FFFFFF" },
  { label: "푸들", value: "102", color: "#A0522D" },
  { label: "포메라니안", value: "103", color: "#D2691E" },
  { label: "치와와", value: "104", color: "#F5DEB3" },
  { label: "시츄", value: "105", color: "#DEB887" },
  { label: "요크셔테리어", value: "106", color: "#708090" },
  { label: "비숑 프리제", value: "107", color: "#FFFFFF" },
  { label: "닥스훈트", value: "108", color: "#8B4513" },
  { label: "미니어처 슈나우저", value: "109", color: "#808080" },
  { label: "말티푸", value: "110", color: "#F5DEB3" },

  // 중형견
  { label: "웰시코기", value: "201", color: "#CD853F" },
  { label: "비글", value: "202", color: "#8B4513" },
  { label: "시바견", value: "203", color: "#DAA520" },
  { label: "보더콜리", value: "204", color: "#000000" },
  { label: "프렌치 불독", value: "205", color: "#000000" },
  { label: "코카 스파니엘", value: "206", color: "#D2B48C" },
  { label: "진돗개", value: "207", color: "#FFFFF0" },
  { label: "스피츠", value: "208", color: "#FFFFFF" },

  // 대형견
  { label: "골든 리트리버", value: "301", color: "#F0E68C" },
  { label: "래브라도 리트리버", value: "302", color: "#F5F5DC" },
  { label: "사모예드", value: "303", color: "#FFFFFF" },
  { label: "시베리안 허스키", value: "304", color: "#A9A9A9" },
  { label: "저먼 셰퍼드", value: "305", color: "#553518" },
  { label: "로트와일러", value: "306", color: "#000000" },
  { label: "올드 잉글리쉬 쉽독", value: "307", color: "#D3D3D3" },

  // 기타
  { label: "기타", value: "000", color: "#D3D3D3" },
];

/**
 * 코드를 입력하면 견종명(한글)을 반환하는 유틸 함수
 */
export const getBreedName = (code: string | undefined): string => {
  if (!code) return "알 수 없음";
  const breed = BREED_LIST.find((item) => item.value === code);
  return breed ? breed.label : "알 수 없음";
};

/**
 * 코드를 입력하면 대표 색상(Hex)을 반환하는 유틸 함수 (초기 색상 세팅 시 유용)
 */
export const getBreedDefaultColor = (code: string | undefined): string => {
  if (!code) return "#FFFFFF";
  const breed = BREED_LIST.find((item) => item.value === code);
  return breed ? breed.color : "#FFFFFF";
};
