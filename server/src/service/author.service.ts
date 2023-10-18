import { Injectable, HttpException, HttpStatus, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, FindOneOptions } from 'typeorm';
import { AuthorDTO } from '../service/dto/author.dto';
import { AuthorMapper } from '../service/mapper/author.mapper';
import { AuthorRepository } from '../repository/author.repository';

const relationshipNames = [];

@Injectable()
export class AuthorService {
    logger = new Logger('AuthorService');

    constructor(@InjectRepository(AuthorRepository) private authorRepository: AuthorRepository) {}

    async findById(id: number): Promise<AuthorDTO | undefined> {
        const options = { relations: relationshipNames };
        const result = await this.authorRepository.findOne(id, options);
        return AuthorMapper.fromEntityToDTO(result);
    }

    async findByFields(options: FindOneOptions<AuthorDTO>): Promise<AuthorDTO | undefined> {
        const result = await this.authorRepository.findOne(options);
        return AuthorMapper.fromEntityToDTO(result);
    }

    async findAndCount(options: FindManyOptions<AuthorDTO>): Promise<[AuthorDTO[], number]> {
        options.relations = relationshipNames;
        const resultList = await this.authorRepository.findAndCount(options);
        const authorDTO: AuthorDTO[] = [];
        if (resultList && resultList[0]) {
            resultList[0].forEach((author) => authorDTO.push(AuthorMapper.fromEntityToDTO(author)));
            resultList[0] = authorDTO;
        }
        return resultList;
    }

    async save(authorDTO: AuthorDTO, creator?: string): Promise<AuthorDTO | undefined> {
        const entity = AuthorMapper.fromDTOtoEntity(authorDTO);
        if (creator) {
            if (!entity.createdBy) {
                entity.createdBy = creator;
            }
            entity.lastModifiedBy = creator;
        }
        const result = await this.authorRepository.save(entity);
        return AuthorMapper.fromEntityToDTO(result);
    }

    async update(authorDTO: AuthorDTO, updater?: string): Promise<AuthorDTO | undefined> {
        const entity = AuthorMapper.fromDTOtoEntity(authorDTO);
        if (updater) {
            entity.lastModifiedBy = updater;
        }
        const result = await this.authorRepository.save(entity);
        return AuthorMapper.fromEntityToDTO(result);
    }

    async deleteById(id: number): Promise<void | undefined> {
        await this.authorRepository.delete(id);
        const entityFind = await this.findById(id);
        if (entityFind) {
            throw new HttpException('Error, entity not deleted!', HttpStatus.NOT_FOUND);
        }
        return;
    }
}
