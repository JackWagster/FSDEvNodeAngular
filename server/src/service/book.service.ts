import { Injectable, HttpException, HttpStatus, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, FindOneOptions } from 'typeorm';
import { BookDTO } from '../service/dto/book.dto';
import { BookMapper } from '../service/mapper/book.mapper';
import { BookRepository } from '../repository/book.repository';

const relationshipNames = [];
relationshipNames.push('authors');

@Injectable()
export class BookService {
    logger = new Logger('BookService');

    constructor(@InjectRepository(BookRepository) private bookRepository: BookRepository) {}

    async findById(id: number): Promise<BookDTO | undefined> {
        const options = { relations: relationshipNames };
        const result = await this.bookRepository.findOne(id, options);
        return BookMapper.fromEntityToDTO(result);
    }

    async findByFields(options: FindOneOptions<BookDTO>): Promise<BookDTO | undefined> {
        const result = await this.bookRepository.findOne(options);
        return BookMapper.fromEntityToDTO(result);
    }

    async findAndCount(options: FindManyOptions<BookDTO>): Promise<[BookDTO[], number]> {
        options.relations = relationshipNames;
        const resultList = await this.bookRepository.findAndCount(options);
        const bookDTO: BookDTO[] = [];
        if (resultList && resultList[0]) {
            resultList[0].forEach((book) => bookDTO.push(BookMapper.fromEntityToDTO(book)));
            resultList[0] = bookDTO;
        }
        return resultList;
    }

    async save(bookDTO: BookDTO, creator?: string): Promise<BookDTO | undefined> {
        const entity = BookMapper.fromDTOtoEntity(bookDTO);
        if (creator) {
            if (!entity.createdBy) {
                entity.createdBy = creator;
            }
            entity.lastModifiedBy = creator;
        }
        const result = await this.bookRepository.save(entity);
        return BookMapper.fromEntityToDTO(result);
    }

    async update(bookDTO: BookDTO, updater?: string): Promise<BookDTO | undefined> {
        const entity = BookMapper.fromDTOtoEntity(bookDTO);
        if (updater) {
            entity.lastModifiedBy = updater;
        }
        const result = await this.bookRepository.save(entity);
        return BookMapper.fromEntityToDTO(result);
    }

    async deleteById(id: number): Promise<void | undefined> {
        await this.bookRepository.delete(id);
        const entityFind = await this.findById(id);
        if (entityFind) {
            throw new HttpException('Error, entity not deleted!', HttpStatus.NOT_FOUND);
        }
        return;
    }
}
