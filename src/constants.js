const WIDTH = 800;
const HEIGHT = 600;
const CENTER_X = WIDTH / 2;
const LINE_OF_SCRIMMAGE_Y = HEIGHT - 250;

export const initialPlayersTemplate = [
  {
    id: "C",
    x: CENTER_X,
    y: LINE_OF_SCRIMMAGE_Y,
    shape: "square",
    fill: "#374151",
    textColor: "white",
    border: false,
  },
  {
    id: "Y",
    x: 100,
    y: LINE_OF_SCRIMMAGE_Y,
    shape: "circle",
    fill: "#3B82F6",
    textColor: "white",
    border: false,
  },
  {
    id: "Z",
    x: CENTER_X + 100,
    y: LINE_OF_SCRIMMAGE_Y,
    shape: "circle",
    fill: "#10B981",
    textColor: "white",
    border: false,
  },
  {
    id: "X",
    x: WIDTH - 100,
    y: LINE_OF_SCRIMMAGE_Y,
    shape: "circle",
    fill: "#F97316",
    textColor: "black",
    border: false,
  },
  {
    id: "Q",
    x: CENTER_X,
    y: LINE_OF_SCRIMMAGE_Y + 75,
    shape: "circle",
    fill: "#EF4444",
    textColor: "white",
    border: false,
  },
];

export const colorOptions = [
  "#3B82F6", // Blue
  "#EF4444", // Red
  "#10B981", // Green
  "#F97316", // Orange
  "#374151", // Slate
  "#6366F1", // Indigo
  "#FBBF24", // Amber
  "#A16207", // Warm Brown
  "#FB7185", // Coral
  "#84CC16", // Lime
];

export const shapeOptions = ["circle", "square", "oval", "star"];
export const endMarkerOptions = ["arrow", "dot", "T"];
