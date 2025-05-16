import {
  EntityManager,
  FindOperator,
  FindOptionsOrder,
  FindOptionsWhere,
  ObjectLiteral,
  Repository,
} from "typeorm";

export type ExtendedFindOptionsWhere<T> = FindOptionsWhere<T> & {
  categories?: FindOperator<number[]>;
};

export default interface IViewRepository<T extends ObjectLiteral> extends Repository<T> {
  with_transaction(manager: EntityManager): this;

  find(options?: {
    where?: ExtendedFindOptionsWhere<T>;
    order?: FindOptionsOrder<T>;
    skip?: number;
    take?: number;
  }): Promise<T[]>;
}
