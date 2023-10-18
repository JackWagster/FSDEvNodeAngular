import { NgModule } from '@angular/core';

import { SharedModule } from 'app/shared/shared.module';
import { BookStoreComponent } from './list/book-store.component';
import { BookStoreDetailComponent } from './detail/book-store-detail.component';
import { BookStoreUpdateComponent } from './update/book-store-update.component';
import { BookStoreDeleteDialogComponent } from './delete/book-store-delete-dialog.component';
import { BookStoreRoutingModule } from './route/book-store-routing.module';

@NgModule({
  imports: [SharedModule, BookStoreRoutingModule],
  declarations: [BookStoreComponent, BookStoreDetailComponent, BookStoreUpdateComponent, BookStoreDeleteDialogComponent],
  entryComponents: [BookStoreDeleteDialogComponent],
})
export class BookStoreModule {}
