/* eslint-disable @typescript-eslint/no-unused-vars */
import { Entity, Column, JoinColumn, OneToOne, ManyToOne, OneToMany, ManyToMany, JoinTable } from 'typeorm';
import { BaseEntity } from './base/base.entity';

import { Author } from './author.entity';
import { BookStore } from './book-store.entity';

/**
 * Task entity.\n@author The JHipster team.
 */
@Entity('book')
export class Book extends BaseEntity {
    @Column({ name: 'title' })
    title: string;

    @Column({ name: 'description', nullable: true })
    description: string;

    @ManyToMany((type) => Author)
    @JoinTable({
        name: 'rel_book__author',
        joinColumn: { name: 'book_id', referencedColumnName: 'id' },
        inverseJoinColumn: { name: 'author_id', referencedColumnName: 'id' },
    })
    authors: Author[];

    @ManyToMany((type) => BookStore)
    bookStores: BookStore[];

    // jhipster-needle-entity-add-field - JHipster will add fields here, do not remove
}
