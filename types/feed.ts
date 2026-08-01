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
}
