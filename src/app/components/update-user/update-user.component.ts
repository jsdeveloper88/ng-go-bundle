import { Component, OnInit } from '@angular/core';
import { User } from '../../types/user';
import { ActivatedRoute, Router }
  from '@angular/router';
import {UsersService} from "../../services/users.service";

@Component({
  selector: 'app-update-user',
  templateUrl: './update-user.component.html',
  styleUrls: ['./update-user.component.css']
})
export class UpdateUserComponent implements OnInit {

  id: string;
  user: User;
  updated = false;

  constructor(private route: ActivatedRoute,
              private router: Router,
              private userService: UsersService) {
    this.id = this.route.snapshot.params['id'];
    this.user = new User();
  }

  ngOnInit() {


    this.userService.getUser(this.id)
      .subscribe(data => {
        // this.user = new User(data.id, );
        this.user = new User(data.id, data.firstName, data.lastName, data.email);
        console.log(data.id, data.firstName, data.lastName, data.email);
      }, error => console.log(error));
  }

  updateUser() {
    this.userService.updateUser(this.id, this.user)
      .subscribe(data => {
        console.log(data);
        // this.user = new User();
        this.gotoList();
      }, error => console.log(error));
  }

  onSubmit() {
    this.updateUser();
    this.updated = true;
  }

  gotoList() {
    this.router.navigate(['/users']);
  }
}
