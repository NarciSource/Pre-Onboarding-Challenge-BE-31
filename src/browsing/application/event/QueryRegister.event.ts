import { EntityManager } from "typeorm";

export default class QueryRegisterEvent {
  constructor(
    public readonly id: number,
    public readonly manager?: EntityManager,
  ) {}
}
