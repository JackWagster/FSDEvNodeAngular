import { Book } from '../../domain/book.entity';
import { BookDTO } from '../dto/book.dto';

/**
 * A Book mapper object.
 */
export class BookMapper {
    static fromDTOtoEntity(entityDTO: BookDTO): Book {
        if (!entityDTO) {
            return;
        }
        let entity = new Book();
        const fields = Object.getOwnPropertyNames(entityDTO);
        fields.forEach((field) => {
            entity[field] = entityDTO[field];
        });
        return entity;
    }

    static fromEntityToDTO(entity: Book): BookDTO {
        if (!entity) {
            return;
        }
        let entityDTO = new BookDTO();

        const fields = Object.getOwnPropertyNames(entity);

        fields.forEach((field) => {
            entityDTO[field] = entity[field];
        });

        return entityDTO;
    }
}
