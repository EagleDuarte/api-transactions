import { Request, Response, NextFunction } from "express";
import { usersList } from "../data/user-list";

export const cpfAvailableMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { cpf } = req.body;

  if (usersList.some((user) => user.cpf === cpf)) {
    return res.status(400).send({
      response: false,
      message: "CPF já registrado no sistema!",
    });
  }

  next();
};
