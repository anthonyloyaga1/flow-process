import { ApiProperty } from '@nestjs/swagger';

export class PaginatedLinksBase {
  @ApiProperty({ title: 'Link de primera página' })
  first?: string;

  @ApiProperty({ title: 'Link de página anterior' })
  previous?: string;

  @ApiProperty({ title: 'Link de página actual' })
  current!: string;

  @ApiProperty({ title: 'Link de página siguiente' })
  next?: string;

  @ApiProperty({ title: 'Link de última página' })
  last?: string;
}
