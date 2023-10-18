jest.mock('@angular/router');

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { of, Subject } from 'rxjs';

import { BookStoreService } from '../service/book-store.service';
import { IBookStore, BookStore } from '../book-store.model';
import { IBook } from 'app/entities/book/book.model';
import { BookService } from 'app/entities/book/service/book.service';

import { BookStoreUpdateComponent } from './book-store-update.component';

describe('Component Tests', () => {
  describe('BookStore Management Update Component', () => {
    let comp: BookStoreUpdateComponent;
    let fixture: ComponentFixture<BookStoreUpdateComponent>;
    let activatedRoute: ActivatedRoute;
    let bookStoreService: BookStoreService;
    let bookService: BookService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        declarations: [BookStoreUpdateComponent],
        providers: [FormBuilder, ActivatedRoute],
      })
        .overrideTemplate(BookStoreUpdateComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(BookStoreUpdateComponent);
      activatedRoute = TestBed.inject(ActivatedRoute);
      bookStoreService = TestBed.inject(BookStoreService);
      bookService = TestBed.inject(BookService);

      comp = fixture.componentInstance;
    });

    describe('ngOnInit', () => {
      it('Should call Book query and add missing value', () => {
        const bookStore: IBookStore = { id: 456 };
        const books: IBook[] = [{ id: 27656 }];
        bookStore.books = books;

        const bookCollection: IBook[] = [{ id: 52586 }];
        spyOn(bookService, 'query').and.returnValue(of(new HttpResponse({ body: bookCollection })));
        const additionalBooks = [...books];
        const expectedCollection: IBook[] = [...additionalBooks, ...bookCollection];
        spyOn(bookService, 'addBookToCollectionIfMissing').and.returnValue(expectedCollection);

        activatedRoute.data = of({ bookStore });
        comp.ngOnInit();

        expect(bookService.query).toHaveBeenCalled();
        expect(bookService.addBookToCollectionIfMissing).toHaveBeenCalledWith(bookCollection, ...additionalBooks);
        expect(comp.booksSharedCollection).toEqual(expectedCollection);
      });

      it('Should update editForm', () => {
        const bookStore: IBookStore = { id: 456 };
        const books: IBook = { id: 73587 };
        bookStore.books = [books];

        activatedRoute.data = of({ bookStore });
        comp.ngOnInit();

        expect(comp.editForm.value).toEqual(expect.objectContaining(bookStore));
        expect(comp.booksSharedCollection).toContain(books);
      });
    });

    describe('save', () => {
      it('Should call update service on save for existing entity', () => {
        // GIVEN
        const saveSubject = new Subject();
        const bookStore = { id: 123 };
        spyOn(bookStoreService, 'update').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ bookStore });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: bookStore }));
        saveSubject.complete();

        // THEN
        expect(comp.previousState).toHaveBeenCalled();
        expect(bookStoreService.update).toHaveBeenCalledWith(bookStore);
        expect(comp.isSaving).toEqual(false);
      });

      it('Should call create service on save for new entity', () => {
        // GIVEN
        const saveSubject = new Subject();
        const bookStore = new BookStore();
        spyOn(bookStoreService, 'create').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ bookStore });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: bookStore }));
        saveSubject.complete();

        // THEN
        expect(bookStoreService.create).toHaveBeenCalledWith(bookStore);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).toHaveBeenCalled();
      });

      it('Should set isSaving to false on error', () => {
        // GIVEN
        const saveSubject = new Subject();
        const bookStore = { id: 123 };
        spyOn(bookStoreService, 'update').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ bookStore });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.error('This is an error!');

        // THEN
        expect(bookStoreService.update).toHaveBeenCalledWith(bookStore);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).not.toHaveBeenCalled();
      });
    });

    describe('Tracking relationships identifiers', () => {
      describe('trackBookById', () => {
        it('Should return tracked Book primary key', () => {
          const entity = { id: 123 };
          const trackResult = comp.trackBookById(0, entity);
          expect(trackResult).toEqual(entity.id);
        });
      });
    });

    describe('Getting selected relationships', () => {
      describe('getSelectedBook', () => {
        it('Should return option if no Book is selected', () => {
          const option = { id: 123 };
          const result = comp.getSelectedBook(option);
          expect(result === option).toEqual(true);
        });

        it('Should return selected Book for according option', () => {
          const option = { id: 123 };
          const selected = { id: 123 };
          const selected2 = { id: 456 };
          const result = comp.getSelectedBook(option, [selected2, selected]);
          expect(result === selected).toEqual(true);
          expect(result === selected2).toEqual(false);
          expect(result === option).toEqual(false);
        });

        it('Should return option if this Book is not selected', () => {
          const option = { id: 123 };
          const selected = { id: 456 };
          const result = comp.getSelectedBook(option, [selected]);
          expect(result === option).toEqual(true);
          expect(result === selected).toEqual(false);
        });
      });
    });
  });
});
