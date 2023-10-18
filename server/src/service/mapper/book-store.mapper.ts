import { BookStore } from '../../domain/book-store.entity';
import { BookStoreDTO } from '../dto/book-store.dto';

/**
 * A BookStore mapper object.
 */
export class BookStoreMapper {
    static fromDTOtoEntity(entityDTO: BookStoreDTO): BookStore {
        if (!entityDTO) {
            return;
        }
        let entity = new BookStore();
        const fields = Object.getOwnPropertyNames(entityDTO);
        fields.forEach((field) => {
            entity[field] = entityDTO[field];
        });
        return entity;
    }

    static fromEntityToDTO(entity: BookStore): BookStoreDTO {
        if (!entity) {
            return;
        }
        let entityDTO = new BookStoreDTO();

        const fields = Object.getOwnPropertyNames(entity);

        fields.forEach((field) => {
            entityDTO[field] = entity[field];
        });

        return entityDTO;
    }
}
