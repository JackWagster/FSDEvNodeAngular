import { EntityRepository, Repository } from 'typeorm';
import { Author } from '../domain/author.entity';

@EntityRepository(Author)
export class AuthorRepository extends Repository<Author> {}
