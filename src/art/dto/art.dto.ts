import { ApiProperty } from '@nestjs/swagger';

export class ArtDto {
    @ApiProperty()
    page: number;

    @ApiProperty()
    pageSize: number;

    @ApiProperty()
    search: string;
}

export class ArtCommentDto {
    @ApiProperty()
    message: string;

    @ApiProperty()
    rate: number;
}

export class ArtNewDto {
    @ApiProperty()
    code?: string;

    @ApiProperty()
    title: string;

    @ApiProperty()
    cat_ref: number;

    @ApiProperty()
    description?: string;

    @ApiProperty()
    properties?: string;

    @ApiProperty()
    files: ArtFilesDto[];
}


export class ArtFilesDto {
    @ApiProperty()
    title: string;

    @ApiProperty()
    file: string;
}


