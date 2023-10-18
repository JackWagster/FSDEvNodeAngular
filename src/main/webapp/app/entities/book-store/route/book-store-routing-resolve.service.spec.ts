jest.mock('@angular/router');

import { TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { of } from 'rxjs';

import { IBookStore, BookStore } from '../book-store.model';
import { BookStoreService } from '../service/book-store.service';

import { BookStoreRoutingResolveService } from './book-store-routing-resolve.service';

describe('Service Tests', () => {
  describe('BookStore routing resolve service', () => {
    let mockRouter: Router;
    let mockActivatedRouteSnapshot: ActivatedRouteSnapshot;
    let routingResolveService: BookStoreRoutingResolveService;
    let service: BookStoreService;
    let resultBookStore: IBookStore | undefined;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        providers: [Router, ActivatedRouteSnapshot],
      });
      mockRouter = TestBed.inject(Router);
      mockActivatedRouteSnapshot = TestBed.inject(ActivatedRouteSnapshot);
      routingResolveService = TestBed.inject(BookStoreRoutingResolveService);
      service = TestBed.inject(BookStoreService);
      resultBookStore = undefined;
    });

    describe('resolve', () => {
      it('should return IBookStore returned by find', () => {
        // GIVEN
        service.find = jest.fn(id => of(new HttpResponse({ body: { id } })));
        mockActivatedRouteSnapshot.params = { id: 123 };

        // WHEN
        routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
          resultBookStore = result;
        });

        // THEN
        expect(service.find).toBeCalledWith(123);
        expect(resultBookStore).toEqual({ id: 123 });
      });

      it('should return new IBookStore if id is not provided', () => {
        // GIVEN
        service.find = jest.fn();
        mockActivatedRouteSnapshot.params = {};

        // WHEN
        routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
          resultBookStore = result;
        });

        // THEN
        expect(service.find).not.toBeCalled();
        expect(resultBookStore).toEqual(new BookStore());
      });

      it('should route to 404 page if data not found in server', () => {
        // GIVEN
        spyOn(service, 'find').and.returnValue(of(new HttpResponse({ body: null })));
        mockActivatedRouteSnapshot.params = { id: 123 };

        // WHEN
        routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
          resultBookStore = result;
        });

        // THEN
        expect(service.find).toBeCalledWith(123);
        expect(resultBookStore).toEqual(undefined);
        expect(mockRouter.navigate).toHaveBeenCalledWith(['404']);
      });
    });
  });
});
