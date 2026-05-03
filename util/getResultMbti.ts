export const getResultMbti = (answers: string[]): string => {
  const counts: Record<string, number> = {
    E: 0,
    I: 0,
    S: 0,
    N: 0,
    T: 0,
    F: 0,
    J: 0,
    P: 0,
  };

  // 1. 각 문자들의 등장 횟수를 카운트
  answers.forEach((answer) => {
    if (counts[answer] !== undefined) {
      counts[answer]++;
    }
  });

  // 2. 각 지표별로 더 많이 선택된 항목을 판별 (개수가 같으면 기본값 부여)
  const ei = counts.E >= counts.I ? "E" : "I";
  const sn = counts.S >= counts.N ? "S" : "N";
  const tf = counts.T >= counts.F ? "T" : "F";
  const jp = counts.J >= counts.P ? "J" : "P";

  // 3. 최종 조합 반환
  return `${ei}${sn}${tf}${jp}`;
};
