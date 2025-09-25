import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("routes/home.tsx"),
  route("/game1", "routes/game1.tsx"),
  route("/game2", "routes/game2.tsx"),
  route("/game3", "routes/game3.tsx"),
  route("/quizz1", "routes/quizz1.tsx"),
  route("/quizz2", "routes/quizz2.tsx"),
  route("/quizz3", "routes/quizz3.tsx"),
] satisfies RouteConfig;
