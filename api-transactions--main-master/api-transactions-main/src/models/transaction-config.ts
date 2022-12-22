import { v4 as createUuid } from "uuid";

class Transaction {
  private _id: string;

  constructor(
    private _title: string,
    private _value: number,
    private _type: string
  ) {
    this._id = createUuid();
  }

  public get id() {
    return this._id;
  }

  public get title() {
    return this._title;
  }

  public set title(title: string) {
    this._title = title;
  }

  public get value() {
    return this._value;
  }

  public set value(value: number) {
    this._value = value;
  }

  public get type() {
    return this._type;
  }

  public set type(type: string) {
    this._type = type;
  }
}

export { Transaction };
