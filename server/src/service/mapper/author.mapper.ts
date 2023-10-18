import { Author } from '../../domain/author.entity';
import { AuthorDTO } from '../dto/author.dto';

/**
 * A Author mapper object.
 */
export class AuthorMapper {
    static fromDTOtoEntity(entityDTO: AuthorDTO): Author {
        if (!entityDTO) {
            return;
        }
        const entity = new Author();
        const fields = Object.getOwnPropertyNames(entityDTO);
        fields.forEach(field => {
            entity[field] = entityDTO[field];
        });
        return entity;
    }

    static fromEntityToDTO(entity: Author): AuthorDTO {
        if (!entity) {
            return;
        }
        const entityDTO = new AuthorDTO();

        const fields = Object.getOwnPropertyNames(entity);

        fields.forEach(field => {
            entityDTO[field] = entity[field];
        });

        return entityDTO;
    }
}
