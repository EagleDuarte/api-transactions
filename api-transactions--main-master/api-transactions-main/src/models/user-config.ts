import { v4 as createUuid } from "uuid";
import { Transaction } from "./transaction-config";

class User {
  private _id: string;
  private _transactions: Transaction[];

  constructor(
    private _name: string,
    private _cpf: number,
    private _email: string,
    private _age: number
  ) {
    this._id = createUuid();
    this._transactions = [];
  }

  public get id() {
    return this._id;
  }

  public get name() {
    return this._name;
  }

  public set name(name: string) {
    this._name = name;
  }

  public get cpf() {
    return this._cpf;
  }

  public set cpf(cpf: number) {
    this._cpf = cpf;
  }

  public get email() {
    return this._email;
  }

  public set email(email: string) {
    this._email = email;
  }

  public get age() {
    return this._age;
  }

  public set age(age: number) {
    this._age = age;
  }

  public get transactions() {
    return this._transactions;
  }

  public set transactions(transactions: Transaction[]) {
    this._transactions = transactions;
  }
}

export { User };
