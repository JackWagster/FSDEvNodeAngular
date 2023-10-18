/* eslint-disable @typescript-eslint/no-unused-vars */
import { ApiModelProperty } from '@nestjs/swagger';
import { IsNotEmpty, MinLength, MaxLength, Length, Min, Max, Matches } from 'class-validator';
import { BaseDTO } from './base.dto';

import { AuthorDTO } from './author.dto';
import { BookStoreDTO } from './book-store.dto';

/**
 * A BookDTO object.
 */
export class BookDTO extends BaseDTO {
    @IsNotEmpty()
    @ApiModelProperty({ description: 'title field' })
    title: string;

    @ApiModelProperty({ description: 'description field', required: false })
    description: string;

    @ApiModelProperty({ type: AuthorDTO, isArray: true, description: 'authors relationship' })
    authors: AuthorDTO[];

    @ApiModelProperty({ type: BookStoreDTO, isArray: true, description: 'bookStores relationship' })
    bookStores: BookStoreDTO[];

    // jhipster-needle-entity-add-field - JHipster will add fields here, do not remove
}
