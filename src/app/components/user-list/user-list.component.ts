import { Observable } from "rxjs";
import {User} from "../../types/user";
import { Component, OnInit } from "@angular/core";
import { Router } from '@angular/router';
import {UsersService} from "../../services/users.service";

@Component({
  selector: "app-user-list",
  templateUrl: "./user-list.component.html",
  styleUrls: ["./user-list.component.css"]
})
export class UserListComponent implements OnInit {

  // public users: Observable<User[]>;
  public users: User[] = [] ;

  constructor(private userService: UsersService,
              private router: Router) {
    // this.users = this.userService.getUsersList();
    this.loadData()
  }


  ngOnInit() {

  }

  loadData() {
    // this.users = this.userService.getUsersList();
    this.userService.getUsersList().subscribe(users => {
        this.users = users.map((user: any) => new User(user.id, false, user.firstName, user.lastName, user.email));
      }
    );
  }

  str2Arr(str: string | undefined): string[] {
    return (str || '').split('');
  }

  deleteUser(id: string) {

    this.userService.deleteUser(id)
      .subscribe(
        (data: string) => {
          console.log(data);
          this.loadData();
        },
        error => {
          console.log(error)
        }
      );
  }

  updateUser(user: User){
    // this.router.navigate(['update', id]);
    user.beingUpd = !user.beingUpd;
  }

  userDetails(id: string){
    this.router.navigate(['details', id]);
  }
}
