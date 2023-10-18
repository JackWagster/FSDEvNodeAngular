/* eslint-disable @typescript-eslint/no-unused-vars */
import { Entity, Column, JoinColumn, OneToOne, ManyToOne, OneToMany, ManyToMany, JoinTable } from 'typeorm';
import { BaseEntity } from './base/base.entity';

import { Book } from './book.entity';

/**
 * A Author.
 */
@Entity('author')
export class Author extends BaseEntity {
    @Column({ name: 'fist_name' })
    fistName: string;

    @Column({ name: 'last_name' })
    lastName: string;

    @ManyToMany((type) => Book)
    books: Book[];

    // jhipster-needle-entity-add-field - JHipster will add fields here, do not remove
}
