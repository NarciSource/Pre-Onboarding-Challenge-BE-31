import { ObjectLiteral, Repository } from "typeorm";

export default interface IBrowsingRepository<T extends ObjectLiteral> extends Repository<T> {
  find_by_filters(filters: any);
}
