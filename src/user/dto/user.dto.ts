import { ApiProperty } from '@nestjs/swagger';
import { Gender } from '../../common/enums/enums';

export class UserDto {
  @ApiProperty()
  isArtist: boolean;

  @ApiProperty({ enum: Gender })
  gender: string;

  @ApiProperty()
  firstname: string;

  @ApiProperty()
  lastname: string;

  @ApiProperty()
  extentionname?: string;

  @ApiProperty()
  bio_small?: string;

  @ApiProperty()
  bio_long?: string;

  @ApiProperty()
  address?: string;

  @ApiProperty()
  email?: string;

  @ApiProperty()
  website?: string;

  @ApiProperty()
  nationalCode?: string;

  @ApiProperty()
  socialNetworks?: string;

  @ApiProperty()
  birthDate?: string;

  @ApiProperty()
  city_ref?: number;

  @ApiProperty()
  skills?: number[];

}

export class UserAvatarDto {
  @ApiProperty()
  path: string;
}
