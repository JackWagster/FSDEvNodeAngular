import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IBookStore, getBookStoreIdentifier } from '../book-store.model';

export type EntityResponseType = HttpResponse<IBookStore>;
export type EntityArrayResponseType = HttpResponse<IBookStore[]>;

@Injectable({ providedIn: 'root' })
export class BookStoreService {
  public resourceUrl = this.applicationConfigService.getEndpointFor('api/book-stores');

  constructor(protected http: HttpClient, private applicationConfigService: ApplicationConfigService) {}

  create(bookStore: IBookStore): Observable<EntityResponseType> {
    return this.http.post<IBookStore>(this.resourceUrl, bookStore, { observe: 'response' });
  }

  update(bookStore: IBookStore): Observable<EntityResponseType> {
    return this.http.put<IBookStore>(`${this.resourceUrl}/${getBookStoreIdentifier(bookStore) as number}`, bookStore, {
      observe: 'response',
    });
  }

  partialUpdate(bookStore: IBookStore): Observable<EntityResponseType> {
    return this.http.patch<IBookStore>(`${this.resourceUrl}/${getBookStoreIdentifier(bookStore) as number}`, bookStore, {
      observe: 'response',
    });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IBookStore>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IBookStore[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addBookStoreToCollectionIfMissing(
    bookStoreCollection: IBookStore[],
    ...bookStoresToCheck: (IBookStore | null | undefined)[]
  ): IBookStore[] {
    const bookStores: IBookStore[] = bookStoresToCheck.filter(isPresent);
    if (bookStores.length > 0) {
      const bookStoreCollectionIdentifiers = bookStoreCollection.map(bookStoreItem => getBookStoreIdentifier(bookStoreItem)!);
      const bookStoresToAdd = bookStores.filter(bookStoreItem => {
        const bookStoreIdentifier = getBookStoreIdentifier(bookStoreItem);
        if (bookStoreIdentifier == null || bookStoreCollectionIdentifiers.includes(bookStoreIdentifier)) {
          return false;
        }
        bookStoreCollectionIdentifiers.push(bookStoreIdentifier);
        return true;
      });
      return [...bookStoresToAdd, ...bookStoreCollection];
    }
    return bookStoreCollection;
  }
}
