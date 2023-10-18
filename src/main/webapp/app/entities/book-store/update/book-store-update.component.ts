import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { IBookStore, BookStore } from '../book-store.model';
import { BookStoreService } from '../service/book-store.service';
import { IBook } from 'app/entities/book/book.model';
import { BookService } from 'app/entities/book/service/book.service';

@Component({
  selector: 'jhi-book-store-update',
  templateUrl: './book-store-update.component.html',
})
export class BookStoreUpdateComponent implements OnInit {
  isSaving = false;

  booksSharedCollection: IBook[] = [];

  editForm = this.fb.group({
    id: [],
    bookStoreName: [],
    postalCode: [],
    city: [],
    stateProvince: [],
    books: [],
  });

  constructor(
    protected bookStoreService: BookStoreService,
    protected bookService: BookService,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ bookStore }) => {
      this.updateForm(bookStore);

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const bookStore = this.createFromForm();
    if (bookStore.id !== undefined) {
      this.subscribeToSaveResponse(this.bookStoreService.update(bookStore));
    } else {
      this.subscribeToSaveResponse(this.bookStoreService.create(bookStore));
    }
  }

  trackBookById(index: number, item: IBook): number {
    return item.id!;
  }

  getSelectedBook(option: IBook, selectedVals?: IBook[]): IBook {
    if (selectedVals) {
      for (const selectedVal of selectedVals) {
        if (option.id === selectedVal.id) {
          return selectedVal;
        }
      }
    }
    return option;
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IBookStore>>): void {
    result.pipe(finalize(() => this.onSaveFinalize())).subscribe(
      () => this.onSaveSuccess(),
      () => this.onSaveError()
    );
  }

  protected onSaveSuccess(): void {
    this.previousState();
  }

  protected onSaveError(): void {
    // Api for inheritance.
  }

  protected onSaveFinalize(): void {
    this.isSaving = false;
  }

  protected updateForm(bookStore: IBookStore): void {
    this.editForm.patchValue({
      id: bookStore.id,
      bookStoreName: bookStore.bookStoreName,
      postalCode: bookStore.postalCode,
      city: bookStore.city,
      stateProvince: bookStore.stateProvince,
      books: bookStore.books,
    });

    this.booksSharedCollection = this.bookService.addBookToCollectionIfMissing(this.booksSharedCollection, ...(bookStore.books ?? []));
  }

  protected loadRelationshipsOptions(): void {
    this.bookService
      .query()
      .pipe(map((res: HttpResponse<IBook[]>) => res.body ?? []))
      .pipe(map((books: IBook[]) => this.bookService.addBookToCollectionIfMissing(books, ...(this.editForm.get('books')!.value ?? []))))
      .subscribe((books: IBook[]) => (this.booksSharedCollection = books));
  }

  protected createFromForm(): IBookStore {
    return {
      ...new BookStore(),
      id: this.editForm.get(['id'])!.value,
      bookStoreName: this.editForm.get(['bookStoreName'])!.value,
      postalCode: this.editForm.get(['postalCode'])!.value,
      city: this.editForm.get(['city'])!.value,
      stateProvince: this.editForm.get(['stateProvince'])!.value,
      books: this.editForm.get(['books'])!.value,
    };
  }
}
