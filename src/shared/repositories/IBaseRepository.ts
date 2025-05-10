import { EntityManager, ObjectLiteral, Repository } from "typeorm";

export default interface IBaseRepository<T extends ObjectLiteral> extends Repository<T> {
  with_transaction(manager: EntityManager): this;
}
