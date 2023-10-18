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
import { AuthorDTO } from '../../service/dto/author.dto';
import { AuthorService } from '../../service/author.service';
import { PageRequest, Page } from '../../domain/base/pagination.entity';
import { AuthGuard, Roles, RolesGuard, RoleType } from '../../security';
import { HeaderUtil } from '../../client/header-util';
import { Request } from '../../client/request';
import { LoggingInterceptor } from '../../client/interceptors/logging.interceptor';

@Controller('api/authors')
@UseGuards(AuthGuard, RolesGuard)
@UseInterceptors(LoggingInterceptor, ClassSerializerInterceptor)
@ApiBearerAuth()
@ApiUseTags('authors')
export class AuthorController {
    logger = new Logger('AuthorController');

    constructor(private readonly authorService: AuthorService) {}

    @Get('/')
    @Roles(RoleType.USER)
    @ApiResponse({
        status: 200,
        description: 'List all records',
        type: AuthorDTO,
    })
    async getAll(@Req() req: Request): Promise<AuthorDTO[]> {
        const pageRequest: PageRequest = new PageRequest(req.query.page, req.query.size, req.query.sort);
        const [results, count] = await this.authorService.findAndCount({
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
        type: AuthorDTO,
    })
    async getOne(@Param('id') id: number): Promise<AuthorDTO> {
        return await this.authorService.findById(id);
    }

    @PostMethod('/')
    @Roles(RoleType.ADMIN)
    @ApiOperation({ title: 'Create author' })
    @ApiResponse({
        status: 201,
        description: 'The record has been successfully created.',
        type: AuthorDTO,
    })
    @ApiResponse({ status: 403, description: 'Forbidden.' })
    async post(@Req() req: Request, @Body() authorDTO: AuthorDTO): Promise<AuthorDTO> {
        const created = await this.authorService.save(authorDTO, req.user?.login);
        HeaderUtil.addEntityCreatedHeaders(req.res, 'Author', created.id);
        return created;
    }

    @Put('/')
    @Roles(RoleType.ADMIN)
    @ApiOperation({ title: 'Update author' })
    @ApiResponse({
        status: 200,
        description: 'The record has been successfully updated.',
        type: AuthorDTO,
    })
    async put(@Req() req: Request, @Body() authorDTO: AuthorDTO): Promise<AuthorDTO> {
        HeaderUtil.addEntityCreatedHeaders(req.res, 'Author', authorDTO.id);
        return await this.authorService.update(authorDTO, req.user?.login);
    }

    @Put('/:id')
    @Roles(RoleType.ADMIN)
    @ApiOperation({ title: 'Update author with id' })
    @ApiResponse({
        status: 200,
        description: 'The record has been successfully updated.',
        type: AuthorDTO,
    })
    async putId(@Req() req: Request, @Body() authorDTO: AuthorDTO): Promise<AuthorDTO> {
        HeaderUtil.addEntityCreatedHeaders(req.res, 'Author', authorDTO.id);
        return await this.authorService.update(authorDTO, req.user?.login);
    }

    @Delete('/:id')
    @Roles(RoleType.ADMIN)
    @ApiOperation({ title: 'Delete author' })
    @ApiResponse({
        status: 204,
        description: 'The record has been successfully deleted.',
    })
    async deleteById(@Req() req: Request, @Param('id') id: number): Promise<void> {
        HeaderUtil.addEntityDeletedHeaders(req.res, 'Author', id);
        return await this.authorService.deleteById(id);
    }
}
