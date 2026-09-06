export interface MbtiResultInfo {
  mbti: string;
  title: string; // 재미있는 별명 (칭호)
  description: string; // 성향에 대한 재미있는 설명
  tags: string[]; // 특징 태그 3가지
  goodMatch: string; // 잘 맞는 멍BTI
  badMatch: string; // 안 맞는 멍BTI
}

export const mbtiResultData: Record<string, MbtiResultInfo> = {
  // ----- E (외향) -----
  ENFP: {
    mbti: "ENFP",
    title: "산책로의 프로 오지라퍼 🌟",
    description:
      "지나가는 모든 강아지와 사람에게 인사해야 직성이 풀리는 핵인싸! 호기심이 많아 새로운 산책로를 좋아하며 감수성도 풍부해서 보호자의 기분을 기가 막히게 잘 알아채요. 다만 너무 흥분하면 제어가 안 될 수 있어요.",
    tags: ["#파워인싸", "#산책로반장", "#우다다대마왕"],
    goodMatch: "INFJ",
    badMatch: "ISTJ",
  },
  ENTP: {
    mbti: "ENTP",
    title: "직진밖에 모르는 불도저 🚀",
    description:
      "겁이 없고 호기심이 넘쳐서 가고 싶은 곳이 생기면 보호자 리드줄을 팽팽하게 끌고 당겨요! 항상 새로운 장난감과 자극을 원하며 고집이 꽤 센 편이라 단호한 훈련이 필요할 때도 있어요.",
    tags: ["#마이웨이", "#개척자", "#에너자이저"],
    goodMatch: "INTJ",
    badMatch: "ISFJ",
  },
  ESFP: {
    mbti: "ESFP",
    title: "관심받고 싶은 파티 애니멀 💃",
    description:
      "사람을 너무 좋아해서 누가 만져주는 걸 세상에서 제일 좋아해요! 산책 중에도 낙엽 냄새보다는 지나가는 사람들에게 애교를 부려 간식을 얻어내는 타고난 연예인입니다.",
    tags: ["#애교쟁이", "#관심집중", "#꼬리헬리콥터"],
    goodMatch: "ISFJ",
    badMatch: "INTJ",
  },
  ESTP: {
    mbti: "ESTP",
    title: "행동파 골목대장 ⚡️",
    description:
      "일단 몸부터 나가는 행동파 행동대장! 산책하다 벌레나 새를 발견하면 바로 쫓아가야 속이 시원해요. 겁 없이 다른 강아지들에게도 먼저 들이대는 당찬 성격이지만 가끔 사고를 치기도 한답니다.",
    tags: ["#사고뭉치", "#행동대장", "#스피드광"],
    goodMatch: "ISFP",
    badMatch: "INFJ",
  },
  ENFJ: {
    mbti: "ENFJ",
    title: "엄마(아빠) 껌딱지 평화주의자 🕊️",
    description:
      "세상 모든 사람과 강아지와 친하게 지내고 싶어 하는 천사! 특히 보호자를 너무 사랑해서 산책 중에도 계속 뒤돌아보며 보호자가 잘 따라오는지 눈을 맞춰주는 다정한 강아지예요.",
    tags: ["#아이컨택장인", "#평화유지군", "#애착인형"],
    goodMatch: "INFP",
    badMatch: "ISTP",
  },
  ENTJ: {
    mbti: "ENTJ",
    title: "위풍당당 산책 지휘관 👑",
    description:
      "어디서나 당당하고 자신감이 넘쳐요! 누가 서열을 정하려고 하면 절대 지지 않는 카리스마. 산책 템포부터 방향까지 자기가 주도해야 직성이 풀리는 당당한 대장님 스타일입니다.",
    tags: ["#보스몹", "#카리스마", "#나만믿고따라와"],
    goodMatch: "INTP",
    badMatch: "ISFP",
  },
  ESFJ: {
    mbti: "ESFJ",
    title: "동네 마당발 반장님 🤝",
    description:
      "루틴을 사랑하고 친구들을 사랑하는 동네 반장님! 매일 같은 시간, 같은 코스로 산책하며 만나는 단골 친구들과 인사하는 걸 가장 큰 행복으로 느껴요. 규칙을 아주 잘 따르는 모범생이기도 합니다.",
    tags: ["#모범생", "#동네요정", "#루틴스틸러"],
    goodMatch: "ISFP",
    badMatch: "INTP",
  },
  ESTJ: {
    mbti: "ESTJ",
    title: "FM 칼퇴근 산책러 ⏱️",
    description:
      "산책의 목적은 확실하게 '배변'과 '영역 표시'! 목적을 달성하면 미련 없이 집으로 방향을 트는 단호함을 보여줍니다. 낯선 곳보다는 익숙한 길을 선호하고, 개인기 훈련 시 간식 보상에 가장 확실하게 반응해요.",
    tags: ["#칼퇴요정", "#칼각규칙", "#목적달성"],
    goodMatch: "ISTP",
    badMatch: "INFP",
  },

  // ----- I (내향) -----
  INFP: {
    mbti: "INFP",
    title: "수줍음 많은 낭만 로맨티스트 🌸",
    description:
      "엄청난 쫄보지만 마음만은 따뜻한 로맨티스트. 낯선 친구가 다가오면 엄마 다리 뒤로 쏙 숨지만, 혼자 있을 땐 떨어지는 낙엽 냄새를 킁킁 맡으며 산책을 여유롭게 즐길 줄 아는 감성 강아지입니다.",
    tags: ["#쫄보", "#감성충만", "#엄마껌딱지"],
    goodMatch: "ENFJ",
    badMatch: "ESTJ",
  },
  INTP: {
    mbti: "INTP",
    title: "사색에 잠긴 몽상가 ☁️",
    description:
      "세상사 별로 관심이 없고 혼자만의 세상에 빠져있는 고양이 같은 강아지! 누가 불러도 귀만 쫑긋하고 쳐다보지 않거나, 산책 중에도 갑자기 멈춰서 한참 동안 허공을 쳐다보며 사색에 잠기곤 해요.",
    tags: ["#마이웨이", "#개냥이", "#멍때리기장인"],
    goodMatch: "ENTJ",
    badMatch: "ESFJ",
  },
  ISFP: {
    mbti: "ISFP",
    title: "순둥순둥 느긋한 자유영혼 🌿",
    description:
      "조용하고 유순하며 다투는 걸 싫어해요. 억지로 끌고 가지 않는 한 자기가 편한 페이스대로 냄새를 맡으며 천천히 산책하는 걸 좋아해요. 침대에서 뒹굴거리는 걸 가장 좋아하는 집돌이/집순이랍니다.",
    tags: ["#집콕요정", "#느긋함", "#평화주의"],
    goodMatch: "ESFJ",
    badMatch: "ENTJ",
  },
  ISTP: {
    mbti: "ISTP",
    title: "독고다이 쿨가이 😎",
    description:
      '"나는 나, 너는 너!" 애교를 부리기보단 자기 혼자만의 시간이 중요한 쿨가이. 다른 강아지들이 시끄럽게 굴면 한심하다는 듯 쳐다보며 자리를 피해요. 필요한 게 있을 때만(밥, 산책) 꼬리를 치는 실용주의자!',
    tags: ["#시크멍", "#독립적", "#필요할때만친한척"],
    goodMatch: "ESTJ",
    badMatch: "ENFJ",
  },
  INFJ: {
    mbti: "INFJ",
    title: "속을 알 수 없는 신비주의 애늙은이 🔮",
    description:
      "조용하지만 모든 상황을 눈치채고 있는 영특함! 눈빛만 봐도 보호자의 기분을 읽고 조용히 옆에 와서 기대어 위로를 건넵니다. 시끄럽고 복잡한 곳보다는 보호자와 둘만의 조용한 산책 코스를 선호해요.",
    tags: ["#애늙은이", "#눈치백단", "#조용한위로"],
    goodMatch: "ENFP",
    badMatch: "ESTP",
  },
  INTJ: {
    mbti: "INTJ",
    title: "영특한 전략가 🎓",
    description:
      "어떻게 하면 간식을 더 얻어먹을 수 있는지 머리를 쓰는 똑똑이! 한 번 정해둔 산책 루트를 틀려고 하면 고집을 부리고, 주인이 던지는 공에 쉽게 낚이지 않는 의심병 말기 환자입니다.",
    tags: ["#천재견", "#고집불통", "#철밀당고수"],
    goodMatch: "ENTP",
    badMatch: "ESFP",
  },
  ISFJ: {
    mbti: "ISFJ",
    title: "주인바라기 해바라기 🌻",
    description:
      "보호자에 대한 맹목적인 사랑과 충성심! 가족을 지키려는 본능이 강해서 외부 소리에 잘 짖기도 해요. 매일 같은 루틴하게 밥 먹고 산책하는 걸 가장 편안하게 느끼는 소심하지만 든든한 가족바라기입니다.",
    tags: ["#가족바보", "#경비견본능", "#순종적"],
    goodMatch: "ESFP",
    badMatch: "ENTP",
  },
  ISTJ: {
    mbti: "ISTJ",
    title: "정확한 생체시계의 소유자 ⏰",
    description:
      "아침 7시 기상, 오후 6시 산책! 시간에 단 1분이라도 오차가 생기면 낑낑대며 항의하는 완벽주의자입니다. 산책로에서도 예외 없이 항상 자기가 표시해둔 전봇대에만 소변을 보는 자기만의 룰이 확실해요.",
    tags: ["#생체알람", "#완벽주의", "#확실한룰"],
    goodMatch: "ESFP",
    badMatch: "ENFP",
  },
};
