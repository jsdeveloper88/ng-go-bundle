import { User } from '../../types/user';

import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import {UsersService} from "../../services/users.service";


@Component({
  selector: 'app-user-details',
  templateUrl: './user-details.component.html',
  styleUrls: ['./user-details.component.css']
})
export class UserDetailsComponent implements OnInit {

  id: string;
  user: User;


  constructor(private route: ActivatedRoute,
              private router: Router,
              private userService: UsersService) {
    this.id = this.route.snapshot.params['id'];
    this.user = new User();
  }

  ngOnInit() {
    console.log("gh"+this.id);
    this.userService.getUser(this.id)
      .subscribe(data => {
        console.log(data)
        this.user = new User(data.id, data.firstName, data.lastName, data.email);
      }, error => console.log(error));
  }

  list(){
    this.router.navigate(['users']);
  }
}
