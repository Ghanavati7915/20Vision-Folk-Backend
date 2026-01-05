import { ApiProperty } from '@nestjs/swagger';
export class CreateSkillDto {
  @ApiProperty()
  title: string;
  @ApiProperty()
  description?: string;
}

export class CreateJobFieldTitleNewDto {
  @ApiProperty()
  title: string;
  @ApiProperty()
  description?: string;
}





