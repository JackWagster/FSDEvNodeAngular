jest.mock('@ng-bootstrap/ng-bootstrap');

import { ComponentFixture, TestBed, inject, fakeAsync, tick } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { BookStoreService } from '../service/book-store.service';

import { BookStoreDeleteDialogComponent } from './book-store-delete-dialog.component';

describe('Component Tests', () => {
  describe('BookStore Management Delete Component', () => {
    let comp: BookStoreDeleteDialogComponent;
    let fixture: ComponentFixture<BookStoreDeleteDialogComponent>;
    let service: BookStoreService;
    let mockActiveModal: NgbActiveModal;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        declarations: [BookStoreDeleteDialogComponent],
        providers: [NgbActiveModal],
      })
        .overrideTemplate(BookStoreDeleteDialogComponent, '')
        .compileComponents();
      fixture = TestBed.createComponent(BookStoreDeleteDialogComponent);
      comp = fixture.componentInstance;
      service = TestBed.inject(BookStoreService);
      mockActiveModal = TestBed.inject(NgbActiveModal);
    });

    describe('confirmDelete', () => {
      it('Should call delete service on confirmDelete', inject(
        [],
        fakeAsync(() => {
          // GIVEN
          spyOn(service, 'delete').and.returnValue(of({}));

          // WHEN
          comp.confirmDelete(123);
          tick();

          // THEN
          expect(service.delete).toHaveBeenCalledWith(123);
          expect(mockActiveModal.close).toHaveBeenCalledWith('deleted');
        })
      ));

      it('Should not call delete service on clear', () => {
        // GIVEN
        spyOn(service, 'delete');

        // WHEN
        comp.cancel();

        // THEN
        expect(service.delete).not.toHaveBeenCalled();
        expect(mockActiveModal.close).not.toHaveBeenCalled();
        expect(mockActiveModal.dismiss).toHaveBeenCalled();
      });
    });
  });
});
