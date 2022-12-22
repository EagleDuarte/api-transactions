import express from "express";
import { userRoutes } from "./routes/user-routes.routes";

const app = express();
app.use(express.json());

app.use("/users", userRoutes);

app.listen(3000, () => {
  console.log("API funcionando...");
});
