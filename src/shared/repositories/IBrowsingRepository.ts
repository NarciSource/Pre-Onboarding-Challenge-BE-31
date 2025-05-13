import {
  EntityManager,
  FindOperator,
  FindOptionsOrder,
  FindOptionsWhere,
  ObjectLiteral,
  Repository,
} from "typeorm";

export default interface IBrowsingRepository<T extends ObjectLiteral> extends Repository<T> {
  with_transaction(manager: EntityManager): this;

  find(options?: {
    where?: FindOptionsWhere<T> & {
      categories?: FindOperator<number[]>;
    };
    order?: FindOptionsOrder<T>;
    skip?: number;
    take?: number;
  }): Promise<T[]>;
}
