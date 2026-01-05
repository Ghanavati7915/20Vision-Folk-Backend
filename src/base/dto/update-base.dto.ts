import { PartialType } from '@nestjs/swagger';
import { CreateSkillDto } from './create-base.dto';

export class UpdateBaseDto extends PartialType(CreateSkillDto) {}