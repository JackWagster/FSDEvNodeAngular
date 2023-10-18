import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IBookStore, BookStore } from '../book-store.model';
import { BookStoreService } from '../service/book-store.service';

@Injectable({ providedIn: 'root' })
export class BookStoreRoutingResolveService implements Resolve<IBookStore> {
  constructor(protected service: BookStoreService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IBookStore> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((bookStore: HttpResponse<BookStore>) => {
          if (bookStore.body) {
            return of(bookStore.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new BookStore());
  }
}
