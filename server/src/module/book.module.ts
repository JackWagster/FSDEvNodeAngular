import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BookController } from '../web/rest/book.controller';
import { BookRepository } from '../repository/book.repository';
import { BookService } from '../service/book.service';

@Module({
    imports: [TypeOrmModule.forFeature([BookRepository])],
    controllers: [BookController],
    providers: [BookService],
    exports: [BookService],
})
export class BookModule {}
