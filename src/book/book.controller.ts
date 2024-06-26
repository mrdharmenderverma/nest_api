import { Body, Controller, Delete, Get, Param, Post, Put, Query, Req, UseGuards } from '@nestjs/common';
import { BookService } from './book.service';
import { Book } from './sehemas/book.schema';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import { Query as ExpressQuery } from 'express-serve-static-core';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';

@Controller('books')
export class BookController {
    constructor(private bookService: BookService){}

    @Get()
    @UseGuards(AuthGuard())
    async getAllBooks(@Query() query: ExpressQuery, @Req() req: Request): Promise<Book[]> {
        return this.bookService.findAll(query, req);
    }

    @Post()
    @UseGuards(AuthGuard())
    async createBook(@Body() book: CreateBookDto, @Req() req,): Promise<Book>{
        // console.log(req);
        return this.bookService.create(book, req.user);
    }

    @Get(':id')
    @UseGuards(AuthGuard())
    async getBook(
        @Param('id')
        id: string,
    ): Promise<Book> {
        return this.bookService.findById(id);
    }

    @Put(':id')
    @UseGuards(AuthGuard())
    async updateBook(
        @Param('id')
        id: string,
        @Body() book: UpdateBookDto,): Promise<Book>{
        return this.bookService.updateById(id, book);
    }

    @Delete(':id')
    @UseGuards(AuthGuard())
    async deleteBook(
        @Param('id')
        id: string): Promise<Book>{
        return this.bookService.deleteById(id);
    }
}
