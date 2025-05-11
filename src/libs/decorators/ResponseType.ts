import { SetMetadata } from "@nestjs/common";

import { RESPONSE_DTO_KEY } from "@libs/interceptors/ResponseInterceptor";

export default (dto: unknown) => SetMetadata(RESPONSE_DTO_KEY, dto);
