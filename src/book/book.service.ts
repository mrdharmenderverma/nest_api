import { BadRequestException, Injectable, NotFoundException, Req, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { Book } from './sehemas/book.schema';
import { Query } from 'express-serve-static-core';
import { User } from '../auth/schemas/user.schema';
import { Request } from 'express';

@Injectable()
export class BookService {
    constructor(
        @InjectModel(Book.name)
        private bookModel: mongoose.Model<Book>
    ) { }

    async findAll(query: Query, req: Request): Promise<Book[]> {

        const resPerPage = 10;
        const currentPage = Number(query.page) || 1;
        const skip = resPerPage * (currentPage - 1);

        let condition: any = {};

        if (req.user) {
            condition = {
                ...condition,
                user: req.user 
            };
        } else {
            
            throw new UnauthorizedException('User not logged in');
        }

        const keyword = query.keyword ? {
            title: {
                $regex: query.keyword as string,
                $options: 'i'
            }
        } : {}

        const books = await this.bookModel.find({
            ...condition,
            ...keyword
        }).limit(resPerPage).skip(skip);
        return books;
    }

    async create(book: Book, user: User): Promise<Book> {

        const data = Object.assign(book, {user: user._id});

        const res = await this.bookModel.create(data);
        return res;
    };

    async findById(id: string): Promise<Book> {
        const isValidId = mongoose.isValidObjectId(id);

        if (!isValidId) {
            throw new BadRequestException('Please enter correct id.')
            
        }

        const book = await this.bookModel.findById(id);

        if (!book) {
            throw new NotFoundException('Book not found');
        }
        return book;
    };

    async updateById(id: string, book: Book): Promise<Book> {
        const bookUpdate = await this.bookModel.findById(id);
        if (!bookUpdate) {
            throw new NotFoundException('Book id deleted.')
        }
        return await this.bookModel.findByIdAndUpdate(id, book, {
            new: true,
            runValidators: true,
        });
    };

    async deleteById(id: string): Promise<Book> {
        
        const bookDelete = await this.bookModel.findById(id);
        if (!bookDelete) {
            throw new NotFoundException('Book id not found.')
        }
        return await this.bookModel.findByIdAndDelete(id);
    };
}
