import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { BookStoreDetailComponent } from './book-store-detail.component';

describe('Component Tests', () => {
  describe('BookStore Management Detail Component', () => {
    let comp: BookStoreDetailComponent;
    let fixture: ComponentFixture<BookStoreDetailComponent>;

    beforeEach(() => {
      TestBed.configureTestingModule({
        declarations: [BookStoreDetailComponent],
        providers: [
          {
            provide: ActivatedRoute,
            useValue: { data: of({ bookStore: { id: 123 } }) },
          },
        ],
      })
        .overrideTemplate(BookStoreDetailComponent, '')
        .compileComponents();
      fixture = TestBed.createComponent(BookStoreDetailComponent);
      comp = fixture.componentInstance;
    });

    describe('OnInit', () => {
      it('Should load bookStore on init', () => {
        // WHEN
        comp.ngOnInit();

        // THEN
        expect(comp.bookStore).toEqual(jasmine.objectContaining({ id: 123 }));
      });
    });
  });
});
