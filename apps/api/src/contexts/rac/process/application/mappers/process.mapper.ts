// import { createMap, Mapper } from '@automapper/core';
// import { AutomapperProfile, InjectMapper } from '@automapper/nestjs';
// import { Injectable } from '@nestjs/common';

// import { Process } from '../../domain/entities/process.entity';
// import { ProcessPrimitives } from '../../domain/types/process.type';
// import { ProcessReadDto } from '../dtos/process.dto';

// export type CreateProcessParams = ConstructorParameters<typeof Process>[0];

// @Injectable()
// export class ProcessAppMapper extends AutomapperProfile {
//   constructor(@InjectMapper() mapper: Mapper) {
//     super(mapper);
//   }

//   override get profile() {
//     return (mapper: Mapper) => {
//       createMap(mapper, ProcessPrimitives, ProcessReadDto);
//     };
//   }
// }
