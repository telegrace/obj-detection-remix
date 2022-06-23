export type VideoRef = React.MutableRefObject<HTMLVideoElement | null>;
export type CanvasRef = React.MutableRefObject<HTMLCanvasElement | null>;

export type Prediction = {
  bbox: [number, number, number, number];
  class: string;
  score: number;
  confidence?: number;
  HTMLStyle?: {
    highlighter: {};
    p: {};
  };
};

export type CanvasCoords = {
  x: number;
  y: number;
};

export type PenObj = {
  position: CanvasCoords;
  isDrawing: boolean;
};

export type MNISTModel = {
  loadedModel: any;
  isloaded: boolean;
};
