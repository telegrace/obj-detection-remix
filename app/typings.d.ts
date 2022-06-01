export type VideoRef = React.MutableRefObject<HTMLVideoElement | null>;

export type Prediction = {
  bbox: [number, number, number, number];
  class: string;
  score: number;
  confidence?: number;
  HTMLStyle?: string;
};
