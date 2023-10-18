import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthorController } from '../web/rest/author.controller';
import { AuthorRepository } from '../repository/author.repository';
import { AuthorService } from '../service/author.service';

@Module({
    imports: [TypeOrmModule.forFeature([AuthorRepository])],
    controllers: [AuthorController],
    providers: [AuthorService],
    exports: [AuthorService],
})
export class AuthorModule {}
