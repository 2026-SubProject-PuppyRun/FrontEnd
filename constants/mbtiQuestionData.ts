export type MBTIAxis = "EI" | "SN" | "TF" | "JP";

export interface MBTIQuestion {
  id: number;
  axis: MBTIAxis;
  question: string;
  answerA: {
    text: string;
    value: "E" | "I" | "S" | "N" | "T" | "F" | "J" | "P";
  };
  answerB: {
    text: string;
    value: "E" | "I" | "S" | "N" | "T" | "F" | "J" | "P";
  };
}

export const mbtiQuestionData: MBTIQuestion[] = [
  // --- E / I : 사회성 및 에너지 방향 ---
  {
    id: 1,
    axis: "EI",
    question: "산책 중 처음 보는 강아지가 다가올 때 우리 강아지는?",
    answerA: {
      text: "꼬리를 프로펠러처럼 빙빙 돌리며 냄새 맡으러 직진!",
      value: "E",
    },
    answerB: {
      text: "보호자 다리 뒤로 숨거나, 무심한 척 휙 지나간다.",
      value: "I",
    },
  },
  {
    id: 2,
    axis: "EI",
    question: "낯선 사람이 다가와서 예쁘다며 말을 걸었을 때?",
    answerA: { text: "벌써 배를 뒤집어 까거나 만져달라고 비빈다.", value: "E" },
    answerB: {
      text: "경계하며 뒷걸음질 치고 쉽게 곁을 주지 않는다.",
      value: "I",
    },
  },
  {
    id: 3,
    axis: "EI",
    question: "애견 카페에 처음 놀러 갔을 때 보여주는 모습은?",
    answerA: {
      text: "여기저기 참견하며 동네방네 인사하기 바쁘다.",
      value: "E",
    },
    answerB: {
      text: "엄마(아빠) 근처에 딱 붙어서 상황부터 조심스럽게 살핀다.",
      value: "I",
    },
  },

  // --- S / N : 탐색 및 산책 스타일 ---
  {
    id: 4,
    axis: "SN",
    question: "평소 산책할 때 가장 좋아하는 행동은?",
    answerA: {
      text: "바닥에 코를 박고 전봇대마다 꼼꼼하게 노즈워크를 즐긴다.",
      value: "S",
    },
    answerB: {
      text: "주변 풍경을 구경하거나, 앞을 향해 씩씩하게 와다다 달린다.",
      value: "N",
    },
  },
  {
    id: 5,
    axis: "SN",
    question: "바스락 낙엽이 떨어지거나 새가 날아갈 때?",
    answerA: {
      text: "크게 신경 쓰지 않고 하던 노즈워크(할 일)에 집중한다.",
      value: "S",
    },
    answerB: {
      text: "호기심 폭발! 무조건 쫓아가 보거나 깜짝 놀라 바라본다.",
      value: "N",
    },
  },
  {
    id: 6,
    axis: "SN",
    question: "장난감을 가지고 놀 때 우리 강아지의 취향은?",
    answerA: {
      text: "최애 장난감 하나만을 집요하고 물고 뜯고 맛본다.",
      value: "S",
    },
    answerB: {
      text: "새로운 장난감을 제일 좋아하고 여러 개를 번갈아 가지고 논다.",
      value: "N",
    },
  },

  // --- T / F : 교감 및 독립성 ---
  {
    id: 7,
    axis: "TF",
    question: "멀리서 다정하게 이름을 불렀을 때의 반응은?",
    answerA: {
      text: "귀만 쫑긋하고 쳐다보거나, 하던 일 마저 한다.",
      value: "T",
    },
    answerB: {
      text: "하던 걸 다 팽개치고 꼬리를 치며 당장 달려온다.",
      value: "F",
    },
  },
  {
    id: 8,
    axis: "TF",
    question: "보호자가 퇴근하고 집에 돌아왔을 때?",
    answerA: {
      text: '"왔어?" 하고 가볍게 꼬리 친 뒤 다시 자기 자리로 쿨하게 간다.',
      value: "T",
    },
    answerB: {
      text: "세상 떠나갈 듯 방방 뛰며 한참을 핥고 안겨 있는다.",
      value: "F",
    },
  },
  {
    id: 9,
    axis: "TF",
    question: "개인기를 연습할 때 어떤 보상을 더 좋아할까?",
    answerA: { text: "목적은 확실하게! 맛있는 '간식'이 최고다.", value: "T" },
    answerB: {
      text: "엄마(아빠)의 높은 톤의 '폭풍 칭찬'과 '스킨십'이 더 좋다.",
      value: "F",
    },
  },

  // --- J / P : 루틴 및 상황 적응력 ---
  {
    id: 10,
    axis: "JP",
    question: "매일 가던 산책로가 아닌 전혀 새로운 낯선 길로 빠지면?",
    answerA: {
      text: "가던 길이 아니라며 고집을 부리거나 멈칫거리며 낯설어한다.",
      value: "J",
    },
    answerB: {
      text: "새로운 냄새와 길에 신나서 발걸음이 더 빨라진다.",
      value: "P",
    },
  },
  {
    id: 11,
    axis: "JP",
    question: "산책 시간이나 밥 시간이 평소보다 조금 늦어지면?",
    answerA: {
      text: "현관문이나 밥그릇 앞에서 낑낑대며 무언의 압박을 강하게 준다.",
      value: "J",
    },
    answerB: {
      text: "조금 늦나보다~ 하고 자기 자리에서 느긋하게 기다리거나 낮잠을 잔다.",
      value: "P",
    },
  },
  {
    id: 12,
    axis: "JP",
    question: "휴일 아침, 우리 강아지의 기상 시간은?",
    answerA: {
      text: "칼같은 생체 시계! 주말에도 항상 똑같은 시간에 깨워달라고 한다.",
      value: "J",
    },
    answerB: {
      text: "보호자가 늦잠을 자면 그 템포에 맞춰서 같이 늦게까지 뒹굴거린다.",
      value: "P",
    },
  },
];
