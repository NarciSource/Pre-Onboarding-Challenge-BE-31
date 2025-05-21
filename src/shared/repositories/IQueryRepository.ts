import {
  FilterQuery,
  MongooseBaseQueryOptions,
  MongooseUpdateQueryOptions,
  PipelineStage,
  ProjectionType,
  QueryOptions,
  UpdateQuery,
  UpdateWithAggregationPipeline,
  UpdateWriteOpResult,
} from "mongoose";

export type FindOptions<T> = {
  where?: FilterQuery<T>;
  order?: { [key: string]: "ASC" | "DESC" };
  take?: number;
  skip?: number;
};

export default interface IQueryRepository<T> {
  save(data: Partial<T>): Promise<void>;

  updateOne(
    where: FilterQuery<T>,
    data: UpdateQuery<T> | UpdateWithAggregationPipeline,
    options?: MongooseUpdateQueryOptions<T>,
  ): Promise<UpdateWriteOpResult>;

  update(
    where: FilterQuery<T>,
    data: UpdateQuery<T> | UpdateWithAggregationPipeline,
    options?: MongooseUpdateQueryOptions<T>,
  ): Promise<UpdateWriteOpResult>;

  findOne(
    where: FilterQuery<T>,
    projection?: ProjectionType<T> | null,
    options?: QueryOptions<T> | null,
  ): Promise<T | null>;

  find(
    { where, order, take, skip }: FindOptions<T>,
    projection?: ProjectionType<T> | null,
    options?: QueryOptions<T> | null,
  ): Promise<T[]>;

  aggregate(pipeline?: PipelineStage[]): Promise<T[]>;

  delete(filter?: FilterQuery<T>, options?: MongooseBaseQueryOptions<T>): Promise<void>;

  get model_name(): string;
}
