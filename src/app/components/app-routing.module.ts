import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';




import { UpdateUserComponent } from "./update-user/update-user.component";
import { UserDetailsComponent } from "./user-details/user-details.component";
import { CreateUserComponent } from "./create-user/create-user.component";



import {UserListComponent} from "./user-list/user-list.component";

import {RouterModule, Routes} from "@angular/router";



const routes: Routes = [
  { path: '', redirectTo: 'users', pathMatch: 'full' },
  { path: 'users', component: UserListComponent },
  { path: 'add', component: CreateUserComponent },
  { path: 'update/:id', component: UpdateUserComponent },
  { path: 'details/:id', component: UserDetailsComponent },
];

@NgModule({
  declarations: [],
  imports: [
    RouterModule.forRoot(routes)
  ],
  exports: [
    RouterModule
  ]
})
export class AppRoutingModule { }
