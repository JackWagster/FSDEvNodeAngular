import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BookStoreController } from '../web/rest/book-store.controller';
import { BookStoreRepository } from '../repository/book-store.repository';
import { BookStoreService } from '../service/book-store.service';

@Module({
    imports: [TypeOrmModule.forFeature([BookStoreRepository])],
    controllers: [BookStoreController],
    providers: [BookStoreService],
    exports: [BookStoreService],
})
export class BookStoreModule {}
