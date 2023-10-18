/* eslint-disable @typescript-eslint/no-unused-vars */
import { ApiModelProperty } from '@nestjs/swagger';
import { BaseDTO } from './base.dto';

import { BookDTO } from './book.dto';

/**
 * A BookStoreDTO object.
 */
export class BookStoreDTO extends BaseDTO {
    @ApiModelProperty({ description: 'bookStoreName field', required: false })
    bookStoreName: string;

    @ApiModelProperty({ description: 'postalCode field', required: false })
    postalCode: string;

    @ApiModelProperty({ description: 'city field', required: false })
    city: string;

    @ApiModelProperty({ description: 'stateProvince field', required: false })
    stateProvince: string;

    @ApiModelProperty({ type: BookDTO, isArray: true, description: 'books relationship' })
    books: BookDTO[];

    // jhipster-needle-entity-add-field - JHipster will add fields here, do not remove
}
