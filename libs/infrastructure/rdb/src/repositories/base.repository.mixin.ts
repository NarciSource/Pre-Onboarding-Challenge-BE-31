import { EntityManager, ObjectLiteral } from "typeorm";

import IBaseRepository from "@libs/domain/repository/IBaseRepository";

const base_repository_mixin = {
  with_transaction<T extends ObjectLiteral>(this: IBaseRepository<T>, manager: EntityManager) {
    return manager.getRepository<T>(this.target).extend(base_repository_mixin);
  },
};

export default base_repository_mixin;
