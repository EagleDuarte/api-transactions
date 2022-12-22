import express from "express";
import { dataUserRoutes } from "./routes/dataUserRoutes.routes";

const app = express();
app.use(express.json());

app.use("/users", dataUserRoutes);

app.listen(3000, () => {
  console.log("API funcionando...");
});
