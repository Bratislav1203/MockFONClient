import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { User } from '../../model/user';

@Component({
  selector: 'app-user-details',
  templateUrl: './user-details.component.html',
  styleUrls: ['./user-details.component.css']
})
export class UserDetailsComponent implements OnInit {
  @Input() user: User;
  @Output() unregister = new EventEmitter<User>();
  constructor() { }

  ngOnInit(): void {
  }

}
