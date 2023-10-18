import {
    Body,
    ClassSerializerInterceptor,
    Controller,
    Delete,
    Get,
    Logger,
    Param,
    Post as PostMethod,
    Put,
    UseGuards,
    Req,
    UseInterceptors,
} from '@nestjs/common';
import { ApiBearerAuth, ApiUseTags, ApiResponse, ApiOperation } from '@nestjs/swagger';
import { BookStoreDTO } from '../../service/dto/book-store.dto';
import { BookStoreService } from '../../service/book-store.service';
import { PageRequest, Page } from '../../domain/base/pagination.entity';
import { AuthGuard, Roles, RolesGuard, RoleType } from '../../security';
import { HeaderUtil } from '../../client/header-util';
import { Request } from '../../client/request';
import { LoggingInterceptor } from '../../client/interceptors/logging.interceptor';

@Controller('api/book-stores')
@UseGuards(AuthGuard, RolesGuard)
@UseInterceptors(LoggingInterceptor, ClassSerializerInterceptor)
@ApiBearerAuth()
@ApiUseTags('book-stores')
export class BookStoreController {
    logger = new Logger('BookStoreController');

    constructor(private readonly bookStoreService: BookStoreService) {}

    @Get('/')
    @Roles(RoleType.USER)
    @ApiResponse({
        status: 200,
        description: 'List all records',
        type: BookStoreDTO,
    })
    async getAll(@Req() req: Request): Promise<BookStoreDTO[]> {
        const pageRequest: PageRequest = new PageRequest(req.query.page, req.query.size, req.query.sort);
        const [results, count] = await this.bookStoreService.findAndCount({
            skip: +pageRequest.page * pageRequest.size,
            take: +pageRequest.size,
            order: pageRequest.sort.asOrder(),
        });
        HeaderUtil.addPaginationHeaders(req.res, new Page(results, count, pageRequest));
        return results;
    }

    @Get('/:id')
    @Roles(RoleType.USER)
    @ApiResponse({
        status: 200,
        description: 'The found record',
        type: BookStoreDTO,
    })
    async getOne(@Param('id') id: number): Promise<BookStoreDTO> {
        return await this.bookStoreService.findById(id);
    }

    @PostMethod('/')
    @Roles(RoleType.ADMIN)
    @ApiOperation({ title: 'Create bookStore' })
    @ApiResponse({
        status: 201,
        description: 'The record has been successfully created.',
        type: BookStoreDTO,
    })
    @ApiResponse({ status: 403, description: 'Forbidden.' })
    async post(@Req() req: Request, @Body() bookStoreDTO: BookStoreDTO): Promise<BookStoreDTO> {
        const created = await this.bookStoreService.save(bookStoreDTO, req.user?.login);
        HeaderUtil.addEntityCreatedHeaders(req.res, 'BookStore', created.id);
        return created;
    }

    @Put('/')
    @Roles(RoleType.ADMIN)
    @ApiOperation({ title: 'Update bookStore' })
    @ApiResponse({
        status: 200,
        description: 'The record has been successfully updated.',
        type: BookStoreDTO,
    })
    async put(@Req() req: Request, @Body() bookStoreDTO: BookStoreDTO): Promise<BookStoreDTO> {
        HeaderUtil.addEntityCreatedHeaders(req.res, 'BookStore', bookStoreDTO.id);
        return await this.bookStoreService.update(bookStoreDTO, req.user?.login);
    }

    @Put('/:id')
    @Roles(RoleType.ADMIN)
    @ApiOperation({ title: 'Update bookStore with id' })
    @ApiResponse({
        status: 200,
        description: 'The record has been successfully updated.',
        type: BookStoreDTO,
    })
    async putId(@Req() req: Request, @Body() bookStoreDTO: BookStoreDTO): Promise<BookStoreDTO> {
        HeaderUtil.addEntityCreatedHeaders(req.res, 'BookStore', bookStoreDTO.id);
        return await this.bookStoreService.update(bookStoreDTO, req.user?.login);
    }

    @Delete('/:id')
    @Roles(RoleType.ADMIN)
    @ApiOperation({ title: 'Delete bookStore' })
    @ApiResponse({
        status: 204,
        description: 'The record has been successfully deleted.',
    })
    async deleteById(@Req() req: Request, @Param('id') id: number): Promise<void> {
        HeaderUtil.addEntityDeletedHeaders(req.res, 'BookStore', id);
        return await this.bookStoreService.deleteById(id);
    }
}
