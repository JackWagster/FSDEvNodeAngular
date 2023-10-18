import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { IBookStore, BookStore } from '../book-store.model';

import { BookStoreService } from './book-store.service';

describe('Service Tests', () => {
  describe('BookStore Service', () => {
    let service: BookStoreService;
    let httpMock: HttpTestingController;
    let elemDefault: IBookStore;
    let expectedResult: IBookStore | IBookStore[] | boolean | null;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
      });
      expectedResult = null;
      service = TestBed.inject(BookStoreService);
      httpMock = TestBed.inject(HttpTestingController);

      elemDefault = {
        id: 0,
        bookStoreName: 'AAAAAAA',
        postalCode: 'AAAAAAA',
        city: 'AAAAAAA',
        stateProvince: 'AAAAAAA',
      };
    });

    describe('Service methods', () => {
      it('should find an element', () => {
        const returnedFromService = Object.assign({}, elemDefault);

        service.find(123).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'GET' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(elemDefault);
      });

      it('should create a BookStore', () => {
        const returnedFromService = Object.assign(
          {
            id: 0,
          },
          elemDefault
        );

        const expected = Object.assign({}, returnedFromService);

        service.create(new BookStore()).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'POST' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should update a BookStore', () => {
        const returnedFromService = Object.assign(
          {
            id: 1,
            bookStoreName: 'BBBBBB',
            postalCode: 'BBBBBB',
            city: 'BBBBBB',
            stateProvince: 'BBBBBB',
          },
          elemDefault
        );

        const expected = Object.assign({}, returnedFromService);

        service.update(expected).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'PUT' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should partial update a BookStore', () => {
        const patchObject = Object.assign(
          {
            bookStoreName: 'BBBBBB',
            postalCode: 'BBBBBB',
            city: 'BBBBBB',
          },
          new BookStore()
        );

        const returnedFromService = Object.assign(patchObject, elemDefault);

        const expected = Object.assign({}, returnedFromService);

        service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'PATCH' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should return a list of BookStore', () => {
        const returnedFromService = Object.assign(
          {
            id: 1,
            bookStoreName: 'BBBBBB',
            postalCode: 'BBBBBB',
            city: 'BBBBBB',
            stateProvince: 'BBBBBB',
          },
          elemDefault
        );

        const expected = Object.assign({}, returnedFromService);

        service.query().subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'GET' });
        req.flush([returnedFromService]);
        httpMock.verify();
        expect(expectedResult).toContainEqual(expected);
      });

      it('should delete a BookStore', () => {
        service.delete(123).subscribe(resp => (expectedResult = resp.ok));

        const req = httpMock.expectOne({ method: 'DELETE' });
        req.flush({ status: 200 });
        expect(expectedResult);
      });

      describe('addBookStoreToCollectionIfMissing', () => {
        it('should add a BookStore to an empty array', () => {
          const bookStore: IBookStore = { id: 123 };
          expectedResult = service.addBookStoreToCollectionIfMissing([], bookStore);
          expect(expectedResult).toHaveLength(1);
          expect(expectedResult).toContain(bookStore);
        });

        it('should not add a BookStore to an array that contains it', () => {
          const bookStore: IBookStore = { id: 123 };
          const bookStoreCollection: IBookStore[] = [
            {
              ...bookStore,
            },
            { id: 456 },
          ];
          expectedResult = service.addBookStoreToCollectionIfMissing(bookStoreCollection, bookStore);
          expect(expectedResult).toHaveLength(2);
        });

        it("should add a BookStore to an array that doesn't contain it", () => {
          const bookStore: IBookStore = { id: 123 };
          const bookStoreCollection: IBookStore[] = [{ id: 456 }];
          expectedResult = service.addBookStoreToCollectionIfMissing(bookStoreCollection, bookStore);
          expect(expectedResult).toHaveLength(2);
          expect(expectedResult).toContain(bookStore);
        });

        it('should add only unique BookStore to an array', () => {
          const bookStoreArray: IBookStore[] = [{ id: 123 }, { id: 456 }, { id: 18493 }];
          const bookStoreCollection: IBookStore[] = [{ id: 123 }];
          expectedResult = service.addBookStoreToCollectionIfMissing(bookStoreCollection, ...bookStoreArray);
          expect(expectedResult).toHaveLength(3);
        });

        it('should accept varargs', () => {
          const bookStore: IBookStore = { id: 123 };
          const bookStore2: IBookStore = { id: 456 };
          expectedResult = service.addBookStoreToCollectionIfMissing([], bookStore, bookStore2);
          expect(expectedResult).toHaveLength(2);
          expect(expectedResult).toContain(bookStore);
          expect(expectedResult).toContain(bookStore2);
        });

        it('should accept null and undefined values', () => {
          const bookStore: IBookStore = { id: 123 };
          expectedResult = service.addBookStoreToCollectionIfMissing([], null, bookStore, undefined);
          expect(expectedResult).toHaveLength(1);
          expect(expectedResult).toContain(bookStore);
        });
      });
    });

    afterEach(() => {
      httpMock.verify();
    });
  });
});
