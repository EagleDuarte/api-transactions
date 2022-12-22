import { NextFunction, Request, Response } from "express";
import { usersList } from "../data/user-list";

export const userAvailableMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { userId } = req.params;

  let user = usersList.find((user) => user.id === userId);

  if (!user) {
    return res.status(404).send({
      response: false,
      message: "Usuário não encontrado!",
    });
  }

  next();
};
