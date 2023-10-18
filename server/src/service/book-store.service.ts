import { Injectable, HttpException, HttpStatus, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, FindOneOptions } from 'typeorm';
import { BookStoreDTO } from '../service/dto/book-store.dto';
import { BookStoreMapper } from '../service/mapper/book-store.mapper';
import { BookStoreRepository } from '../repository/book-store.repository';

const relationshipNames = [];
relationshipNames.push('books');

@Injectable()
export class BookStoreService {
    logger = new Logger('BookStoreService');

    constructor(@InjectRepository(BookStoreRepository) private bookStoreRepository: BookStoreRepository) {}

    async findById(id: number): Promise<BookStoreDTO | undefined> {
        const options = { relations: relationshipNames };
        const result = await this.bookStoreRepository.findOne(id, options);
        return BookStoreMapper.fromEntityToDTO(result);
    }

    async findByFields(options: FindOneOptions<BookStoreDTO>): Promise<BookStoreDTO | undefined> {
        const result = await this.bookStoreRepository.findOne(options);
        return BookStoreMapper.fromEntityToDTO(result);
    }

    async findAndCount(options: FindManyOptions<BookStoreDTO>): Promise<[BookStoreDTO[], number]> {
        options.relations = relationshipNames;
        const resultList = await this.bookStoreRepository.findAndCount(options);
        const bookStoreDTO: BookStoreDTO[] = [];
        if (resultList && resultList[0]) {
            resultList[0].forEach((bookStore) => bookStoreDTO.push(BookStoreMapper.fromEntityToDTO(bookStore)));
            resultList[0] = bookStoreDTO;
        }
        return resultList;
    }

    async save(bookStoreDTO: BookStoreDTO, creator?: string): Promise<BookStoreDTO | undefined> {
        const entity = BookStoreMapper.fromDTOtoEntity(bookStoreDTO);
        if (creator) {
            if (!entity.createdBy) {
                entity.createdBy = creator;
            }
            entity.lastModifiedBy = creator;
        }
        const result = await this.bookStoreRepository.save(entity);
        return BookStoreMapper.fromEntityToDTO(result);
    }

    async update(bookStoreDTO: BookStoreDTO, updater?: string): Promise<BookStoreDTO | undefined> {
        const entity = BookStoreMapper.fromDTOtoEntity(bookStoreDTO);
        if (updater) {
            entity.lastModifiedBy = updater;
        }
        const result = await this.bookStoreRepository.save(entity);
        return BookStoreMapper.fromEntityToDTO(result);
    }

    async deleteById(id: number): Promise<void | undefined> {
        await this.bookStoreRepository.delete(id);
        const entityFind = await this.findById(id);
        if (entityFind) {
            throw new HttpException('Error, entity not deleted!', HttpStatus.NOT_FOUND);
        }
        return;
    }
}
