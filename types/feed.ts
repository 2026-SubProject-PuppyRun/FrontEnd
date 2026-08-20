export interface FeedDetailPet {
  petId: string;
  name: string;
  profileImageUrl: string;
  color: string;
}

export interface FeedDetailWeather {
  temp: string;
  sky: string;
  pty: string;
}

export interface FeedDetail {
  id: string;
  contents?: string;
  title?: string;
  selfieImgUrl: string;
  routeImgUrl?: string;
  route?: { latitude: number; longitude: number }[];
  pace: string;
  distance: number;
  duration: number;
  date: Date;
  diaryId?: string;
  weather?: FeedDetailWeather;
  pets?: FeedDetailPet[];
}
