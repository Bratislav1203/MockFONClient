import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-signup-form',
  templateUrl: './signup-form.component.html',
  styleUrls: ['./signup-form.component.css']
})
export class SignupFormComponent implements OnInit {

  firstName: string;
  lastName: string;
  email: string;
  password: string;

  constructor() { }


  ngOnInit(): void {
  }

  onSubmit(){

  }
}
