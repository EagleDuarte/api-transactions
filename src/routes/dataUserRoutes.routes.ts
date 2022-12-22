import { Request, Response, Router } from "express";
import { usersList } from "../data/user-list";
import { cpfAvailableMiddleware } from "../middlewares/cpf-available.middleware";
import { userAvailableMiddleware } from "../middlewares/user-available.middleware";
import { Transaction } from "../models/transaction-config";
import { User } from "../models/user-config";

export const dataUserRoutes = Router();

dataUserRoutes.post(
  "/",
  [cpfAvailableMiddleware],
  (req: Request, res: Response) => {
    try {
      const { name, cpf, email, age } = req.body;

      if (!name) {
        return res.status(400).send({
          response: false,
          message: "Nome não preenchido",
        });
      }

      if (!cpf) {
        return res.status(400).send({
          response: false,
          message: "CPF não preenchido",
        });
      }

      if (!email) {
        return res.status(400).send({
          response: false,
          message: "Email não preenchido",
        });
      }

      if (!age) {
        return res.status(400).send({
          response: false,
          message: "Idade não preenchida",
        });
      }

      const user = new User(name, cpf, email, age);

      usersList.push(user);

      return res.status(201).send({
        response: true,
        message: "Usuário registrado com sucesso!",
        data: usersList,
      });
    } catch (error: any) {
      return res.status(500).send({
        response: false,
        message: error.toString(),
      });
    }
  }
);

dataUserRoutes.get("/:id", (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    let user = usersList.find((item) => item.id === id);

    if (!user) {
      return res.status(404).send({
        response: false,
        message: "Usuário não encontrado!",
      });
    } else {
      return res.status(200).send({
        id: user.id,
        name: user.name,
        cpf: user.cpf,
        email: user.email,
        age: user.age,
      });
    }
  } catch (error: any) {
    return res.status(500).send({
      response: false,
      message: "Erro no servidor",
      error: error.toString(),
    });
  }
});

dataUserRoutes.get("/", (req: Request, res: Response) => {
  try {
    const { name, email, cpf } = req.query;

    let nameProvided = usersList.find((user) => user.name === name);
    let emailProvided = usersList.find((user) => user.email === email);
    let cpfProvided = usersList.find((user) => user.cpf === Number(cpf));

    if (usersList.length == 0) {
      return res.status(200).send({
        response: true,
        message: "Não há usuário registrado.",
      });
    }

    if (!name && !email && !cpf) {
      return res.status(200).send({
        response: true,
        message: "Usuário registrado com sucesso.",
        data: usersList,
      });
    }

    if (!nameProvided && !emailProvided && !cpfProvided) {
      return res.status(404).send({
        response: false,
        message: "Usuário não encontrado.",
      });
    }

    if (nameProvided) {
      return res.status(200).send({
        id: nameProvided.id,
        name: nameProvided.name,
        cpf: nameProvided.cpf,
        email: nameProvided.email,
        age: nameProvided.age,
      });
    }

    if (emailProvided) {
      return res.status(200).send({
        id: emailProvided.id,
        name: emailProvided.name,
        cpf: emailProvided.cpf,
        email: emailProvided.email,
        age: emailProvided.age,
      });
    }

    if (cpfProvided) {
      return res.status(200).send({
        id: cpfProvided.id,
        name: cpfProvided.name,
        cpf: cpfProvided.cpf,
        email: cpfProvided.email,
        age: cpfProvided.age,
      });
    }
  } catch (error: any) {
    return res.status(500).send({
      response: false,
      message: "Erro no servidor",
      error: error.toString(),
    });
  }
});

dataUserRoutes.delete("/:id", (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    let userIndex = usersList.findIndex((item) => item.id === id);

    if (userIndex < 0) {
      return res.status(404).send({
        response: false,
        message: "Usuário não encontrado!",
      });
    }

    usersList.splice(userIndex, 1);

    return res.status(200).send({
      response: true,
      message: "Usuário deletado com sucesso!",
      data: usersList,
    });
  } catch (error: any) {
    return res.status(500).send({
      response: false,
      message: "Erro no servidor",
      error: error.toString(),
    });
  }
});

dataUserRoutes.put("/:id", (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name, email, age } = req.body;

    let user = usersList.find((item) => item.id === id);

    if (!user) {
      return res.status(404).send({
        response: false,
        message: "Usuário não encontrado!",
      });
    }

    user.name = name;
    user.email = email;
    user.age = age;

    if (!name) {
      return res.status(400).send({
        response: false,
        message: "Nome não preenchido",
      });
    }

    if (!age) {
      return res.status(400).send({
        response: false,
        message: "Idade não preenchida",
      });
    }

    if (!email) {
      return res.status(400).send({
        response: false,
        message: "Email não preenchido",
      });
    }

    return res.status(201).send({
      response: true,
      message: "Usuário atualizado com sucesso!",
      data: usersList,
    });
  } catch (error: any) {
    return res.status(500).send({
      response: false,
      message: "Erro no servidor",
      error: error.toString(),
    });
  }
});

// Abaixo se inicia as transações
dataUserRoutes.post(
  "/:userId/transactions",
  [userAvailableMiddleware],
  (req: Request, res: Response) => {
    try {
      const { title, value, type } = req.body;
      const { userId } = req.params;

      if (!title) {
        return res.status(400).send({
          response: false,
          message: "Título não preenchido!",
        });
      }

      if (!value) {
        return res.status(400).send({
          response: false,
          message: "Valor não preenchido!",
        });
      }

      if (!type) {
        return res.status(400).send({
          response: false,
          message: "Tipo não preenchido!",
        });
      }

      if (type !== "income" && type !== "outcome") {
        return res.status(400).send({
          response: false,
          message:
            "O tipo de valor não é válido, informe o valor do depósito ou da retirada.)",
        });
      }

      const transaction = new Transaction(title, value, type);

      let userTransaction = usersList.find((item) => item.id === userId);

      userTransaction?.transactions.push(transaction);

      return res.status(201).send({
        response: true,
        message: "Transações realizadas com sucesso!",
        data: usersList,
      });
    } catch (error: any) {
      return res.status(500).send({
        response: false,
        message: "Erro no servidor",
        error: error.toString(),
      });
    }
  }
);

dataUserRoutes.get(
  "/:userId/transactions/:id",
  [userAvailableMiddleware],
  (req: Request, res: Response) => {
    try {
      const { userId, id } = req.params;

      let user = usersList.find((user) => user.id === userId);

      let transaction = user?.transactions.find(
        (transaction) => transaction.id === id
      );

      if (!transaction) {
        return res.status(404).send({
          response: false,
          message: "Transações não encontradas!",
        });
      }

      return res.status(200).send(transaction);
    } catch (error: any) {
      return res.status(500).send({
        response: false,
        message: "Erro no servidor",
        error: error.toString(),
      });
    }
  }
);

dataUserRoutes.get("/:userId/transactions", (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const { title, type } = req.query;

    let user = usersList.find((user) => user.id === userId);

    if (!user) {
      return res.status(404).send({
        response: false,
        message: "Usuário não encontrado!",
      });
    }

    let somarIncomes = 0;
    let somaOutcomes = 0;

    for (let transaction of user.transactions) {
      if (transaction.type === "income") {
        somarIncomes = somarIncomes + transaction.value;
      }

      if (transaction.type === "outcome") {
        somaOutcomes = somaOutcomes + transaction.value;
      }
    }

    let creditoTotal = somarIncomes - somaOutcomes;

    if (!title && !type) {
      return res.status(200).send({
        transactions: [user?.transactions],
        balance: {
          incomes: somarIncomes,
          outcomes: somaOutcomes,
          credito: creditoTotal,
        },
      });
    }

    let transactionTitle = user.transactions.filter(
      (transaction) => transaction.title === title
    );
    let transactionType = user.transactions.filter(
      (transaction) => transaction.type === type
    );

    if (!transactionTitle && !transactionType) {
      return res.status(404).send({
        response: false,
        message: "Transações não encontradas!",
      });
    }

    if (title) {
      return res.status(200).send({
        transactions: [transactionTitle],
      });
    }

    if (type) {
      return res.status(200).send({
        transactions: [transactionType],
      });
    }
  } catch (error: any) {
    return res.status(500).send({
      response: false,
      message: "Erro no servidor",
      error: error.toString(),
    });
  }
});

dataUserRoutes.delete(
  "/:userId/transactions/:id",
  (req: Request, res: Response) => {
    try {
      const { userId, id } = req.params;

      let user = usersList.find((user) => user.id === userId);

      if (!user) {
        return res.status(404).send({
          response: false,
          message: "Usuário não encontrado!",
        });
      }

      let transactionIndex = user.transactions.findIndex(
        (transaction) => transaction.id === id
      );

      if (transactionIndex < 0) {
        return res.status(404).send({
          response: false,
          message: "Transações não encontradas!",
        });
      }

      user.transactions.splice(transactionIndex, 1);

      return res.status(200).send({
        response: true,
        message: "Transações deletadas com sucesso!",
        data: user.transactions,
      });
    } catch (error: any) {
      return res.status(500).send({
        response: false,
        message: "Erro no servidor",
        error: error.toString(),
      });
    }
  }
);

dataUserRoutes.put(
  "/:userId/transactions/:id",
  [userAvailableMiddleware],
  (req: Request, res: Response) => {
    try {
      const { userId, id } = req.params;
      const { title, value, type } = req.body;

      let user = usersList.find((user) => user.id === userId);

      let transaction = user?.transactions.find(
        (transaction) => transaction.id === id
      );

      if (!transaction) {
        return res.status(404).send({
          response: false,
          message: "Transações não encontradas!",
        });
      }

      if (!title) {
        return res.status(400).send({
          response: false,
          message: "Título não preenchido!",
        });
      }

      if (!type) {
        return res.status(400).send({
          response: false,
          message: "Tipo não preenchido!",
        });
      }

      if (!value) {
        return res.status(400).send({
          response: false,
          message: "Valor não preenchido!",
        });
      }

      transaction.title = title;
      transaction.type = type;
      transaction.value = value;

      return res.status(201).send({
        response: true,
        message: "Transações editadas com sucesso!",
        data: user?.transactions,
      });
    } catch (error: any) {
      return res.status(500).send({
        response: false,
        message: "Erro no servidor",
        error: error.toString(),
      });
    }
  }
);
