import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { BookStoreComponent } from '../list/book-store.component';
import { BookStoreDetailComponent } from '../detail/book-store-detail.component';
import { BookStoreUpdateComponent } from '../update/book-store-update.component';
import { BookStoreRoutingResolveService } from './book-store-routing-resolve.service';

const bookStoreRoute: Routes = [
  {
    path: '',
    component: BookStoreComponent,
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: BookStoreDetailComponent,
    resolve: {
      bookStore: BookStoreRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: BookStoreUpdateComponent,
    resolve: {
      bookStore: BookStoreRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: BookStoreUpdateComponent,
    resolve: {
      bookStore: BookStoreRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(bookStoreRoute)],
  exports: [RouterModule],
})
export class BookStoreRoutingModule {}
