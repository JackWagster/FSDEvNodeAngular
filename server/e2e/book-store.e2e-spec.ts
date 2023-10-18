import { Test, TestingModule } from '@nestjs/testing';
import request = require('supertest');
import { AppModule } from '../src/app.module';
import { INestApplication } from '@nestjs/common';
import { AuthGuard } from '../src/security/guards/auth.guard';
import { RolesGuard } from '../src/security/guards/roles.guard';
import { BookStoreDTO } from '../src/service/dto/book-store.dto';
import { BookStoreService } from '../src/service/book-store.service';

describe('BookStore Controller', () => {
    let app: INestApplication;

    const authGuardMock = { canActivate: (): any => true };
    const rolesGuardMock = { canActivate: (): any => true };
    const entityMock: any = {
        id: 'entityId',
    };

    const serviceMock = {
        findById: (): any => entityMock,
        findAndCount: (): any => [entityMock, 0],
        save: (): any => entityMock,
        update: (): any => entityMock,
        deleteById: (): any => entityMock,
    };

    beforeEach(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [AppModule],
        })
            .overrideGuard(AuthGuard)
            .useValue(authGuardMock)
            .overrideGuard(RolesGuard)
            .useValue(rolesGuardMock)
            .overrideProvider(BookStoreService)
            .useValue(serviceMock)
            .compile();

        app = moduleFixture.createNestApplication();
        await app.init();
    });

    it('/GET all book-stores ', async () => {
        const getEntities: BookStoreDTO[] = (
            await request(app.getHttpServer())
                .get('/api/book-stores')
                .expect(200)
        ).body;

        expect(getEntities).toEqual(entityMock);
    });

    it('/GET book-stores by id', async () => {
        const getEntity: BookStoreDTO = (
            await request(app.getHttpServer())
                .get('/api/book-stores/' + entityMock.id)
                .expect(200)
        ).body;

        expect(getEntity).toEqual(entityMock);
    });

    it('/POST create book-stores', async () => {
        const createdEntity: BookStoreDTO = (
            await request(app.getHttpServer())
                .post('/api/book-stores')
                .send(entityMock)
                .expect(201)
        ).body;

        expect(createdEntity).toEqual(entityMock);
    });

    it('/PUT update book-stores', async () => {
        const updatedEntity: BookStoreDTO = (
            await request(app.getHttpServer())
                .put('/api/book-stores')
                .send(entityMock)
                .expect(201)
        ).body;

        expect(updatedEntity).toEqual(entityMock);
    });

    it('/PUT update book-stores from id', async () => {
        const updatedEntity: BookStoreDTO = (
            await request(app.getHttpServer())
                .put('/api/book-stores/' + entityMock.id)
                .send(entityMock)
                .expect(201)
        ).body;

        expect(updatedEntity).toEqual(entityMock);
    });

    it('/DELETE book-stores', async () => {
        const deletedEntity: BookStoreDTO = (
            await request(app.getHttpServer())
                .delete('/api/book-stores/' + entityMock.id)
                .expect(204)
        ).body;

        expect(deletedEntity).toEqual({});
    });

    afterEach(async () => {
        await app.close();
    });
});
