import { User } from '../../types/user';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UsersService } from "../../services/users.service";

@Component({
  selector: 'app-create-user',
  templateUrl: './create-user.component.html',
  styleUrls: ['./create-user.component.css']
})
export class CreateUserComponent implements OnInit {

  user: User;
  submitted = false;

  constructor(private userService: UsersService,
              private router: Router) {
    this.user = new User('', false, 'lastName ', 'email ');
    // this.user = new User("", "", "", "");
  }

  ngOnInit() {
  }

  newUser(): void {
    // this.submitted = false;
    // this.user = new User();
  }

  save() {
    this.userService
      .createUser(this.user).subscribe(newbie => {
        console.log(newbie);
        // this.user = new User();
        this.gotoUserList();
      },
      error => console.log(error));
  }

  onSubmit() {
    this.submitted = true;
    this.save();
  }

  gotoUserList() {
    // this.router.navigate(['/users']);
  }
}
