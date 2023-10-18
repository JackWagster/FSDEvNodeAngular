/* eslint-disable @typescript-eslint/no-unused-vars */
import { Entity, Column, JoinColumn, OneToOne, ManyToOne, OneToMany, ManyToMany, JoinTable } from 'typeorm';
import { BaseEntity } from './base/base.entity';

import { Book } from './book.entity';

/**
 * not an ignored comment
 */
@Entity('book_store')
export class BookStore extends BaseEntity {
    @Column({ name: 'book_store_name', nullable: true })
    bookStoreName: string;

    @Column({ name: 'postal_code', nullable: true })
    postalCode: string;

    @Column({ name: 'city', nullable: true })
    city: string;

    @Column({ name: 'state_province', nullable: true })
    stateProvince: string;

    @ManyToMany((type) => Book)
    @JoinTable({
        name: 'rel_book_store__book',
        joinColumn: { name: 'book_store_id', referencedColumnName: 'id' },
        inverseJoinColumn: { name: 'book_id', referencedColumnName: 'id' },
    })
    books: Book[];

    // jhipster-needle-entity-add-field - JHipster will add fields here, do not remove
}
