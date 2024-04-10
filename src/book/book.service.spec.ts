    import { Test, TestingModule } from "@nestjs/testing";
    import { BookController } from "./book.controller";
    import { BookService } from "./book.service";
    import { getModelToken } from "@nestjs/mongoose";
    import { Book, Category } from "./sehemas/book.schema";
    import { Model } from 'mongoose';
    import { User } from '../auth/schemas/user.schema';


    describe('BookService', () => {
        let bookService: BookService;
        let model: Model<Book>;

        const mockBook = {
            _id: "66151b23ae3e873d1d23a3e5",
            user: "661502b5fb635c1146e0dde6",
            title: "Grammar Booksdsd",
            description: "Book Math description",
            author: "Author 3",
            price: 1300,
            category: Category.CLASSICS,
        }

        const mocBookService = {
            findById: jest.fn()
        };

        beforeEach(async () => {
            const module: TestingModule = await Test.createTestingModule({
                controllers: [BookController],
                providers: [
                    BookService,
                    {
                        provide: getModelToken(Book.name),  
                        useValue: mocBookService,
                    },
                    
                ],
            }).compile();
        
            bookService = module.get<BookService>(BookService);
            model = module.get<Model<Book>>(getModelToken(Book.name));
        });
    });


    describe('findById', () => {
        it('should return the book with the given id', async () => {    
            jest.spyOn(mocBookService, 'findById').mockResolvedValue(mockBook);

            const result = await bookService.findById(mockBook._id);

            expect(mocBookService.findById).toHaveBeenCalledWith(mockBook._id);
            expect(result).toEqual(mockBook);
        });

    });    
