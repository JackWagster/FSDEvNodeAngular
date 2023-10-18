import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IBookStore } from '../book-store.model';

@Component({
  selector: 'jhi-book-store-detail',
  templateUrl: './book-store-detail.component.html',
})
export class BookStoreDetailComponent implements OnInit {
  bookStore: IBookStore | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ bookStore }) => {
      this.bookStore = bookStore;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
