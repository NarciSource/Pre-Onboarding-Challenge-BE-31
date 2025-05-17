import { EntityManager } from "typeorm";

export default class QueryUpdateEvent {
  constructor(
    public readonly id: number,
    public readonly manager?: EntityManager,
  ) {}
}
