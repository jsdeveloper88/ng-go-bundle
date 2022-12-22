import { User } from "../../types/user";
import { Component, OnInit } from "@angular/core";
import { Router } from '@angular/router';
import { UsersService } from "../../services/users.service";

import { faEdit } from '@fortawesome/free-solid-svg-icons';
import { faRemove } from '@fortawesome/free-solid-svg-icons';
import { faInfoCircle } from '@fortawesome/free-solid-svg-icons';
import { faSave } from '@fortawesome/free-solid-svg-icons';
import { faCancel } from "@fortawesome/free-solid-svg-icons";

@Component({
  selector: "app-user-list",
  templateUrl: "./user-list.component.html",
  styleUrls: ["./user-list.component.css"]
})
export class UserListComponent implements OnInit {

  public users: User[] = [];

  icons = {
    faEdit: faEdit,
    faRemove: faRemove,
    faInfoCircle: faInfoCircle,
    faSave: faSave,
    faCancel: faCancel
  };

  userListLoader: boolean = false;
  userListError: null | string = null;

  loaders: { [userId: string]: { save: boolean, del: boolean } } = {};
  errors: { [userId: string]: { saveMess: null | string, delMess: null | string } } = {};

  constructor(private userService: UsersService,
              private router: Router) {
    this.loadUserList()
  }

  ngOnInit() {

  }

  loadUserList() {
    this.userListLoader = true;

    this.userService.getUsersList().subscribe(
      (users: null | object[]) => {
        this.userListLoader = false;

        if (users) {
          this.users =
            users.map((user: any) => new User(user.id, user.firstName, user.lastName, user.email));

          this.users.forEach((user: User) => {
            this.loaders[user.id] = {save: false, del: false};
            this.errors[user.id] = {saveMess: null, delMess: null};
          });
        }
      },

      (error: object) => {
        this.userListLoader = false;
        this.userListError = JSON.stringify(error);

        console.log(this.userListError);
      }
    );
  }

  deleteUser(id: string) {
    this.loaders[id].del = true;

    this.userService.deleteUser(id)
      .subscribe(
        (response: string) => {
          console.log(response);

          this.loaders[id].del = false;
          this.loadUserList();
        },

        (error: object) => {
          console.log(error);

          this.loaders[id].del = false;
          this.errors[id].delMess = JSON.stringify(error);
        }
      );
  }

  updateUser(user: User) {
    user.beingUpd = !user.beingUpd;

    if (user.beingUpd == true) {
      localStorage.setItem(user.id, JSON.stringify(user)); // save old user
    } else {
      this.userUpdate.cancel(user);
    }
  }

  userUpdate = {
    cancel: (user: User) => {
      let oldUser = JSON.parse(localStorage.getItem(user.id) as string); // get old user

      user.firstName = oldUser.firstName;
      user.lastName = oldUser.lastName;
      user.email = oldUser.email;
      user.beingUpd = false;

      localStorage.removeItem(user.id); // remove current user from localStorage
    },

    save: (user: User) => {
      this.loaders[user.id].save = true;

      this.userService.updateUser(user.id, user).subscribe(
        (data: object) => {
          console.log(data);

          this.loaders[user.id].save = false;
          this.loadUserList();
          user.beingUpd = false;
        },
        (error: object) => {
          console.log(error)

          this.loaders[user.id].save = false;
          this.errors[user.id].saveMess = JSON.stringify(error);
        });
    }
  }

  userDetails(id: string){
    this.router.navigate(['details', id]);
  }
}
