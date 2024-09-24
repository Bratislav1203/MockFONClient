import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AuthComponent } from './components/login/auth.component';
import { FormsModule } from '@angular/forms';
import { SignupFormComponent } from './components/login/signup-form/signup-form.component';
import { LoginFormComponent } from './components/login/login-form/login-form.component';
import { ExamsComponent } from './components/exams/exams.component';
import { ExamCardComponent } from './components/exams/exam-card/exam-card.component';
import { ExamDetailsComponent } from './components/exams/exam-details/exam-details.component';
import { HeaderComponent} from './components/header/header.component';
import { PaymentComponent } from './components/payment/payment.component';
import { HttpClientModule } from '@angular/common/http';
import { AddExamComponent } from './components/exams/add-exam/add-exam.component';
import { PaymentSlipComponent } from './components/payment-slip/payment-slip.component';
import { VerificationComponent } from './components/verification/verification.component';
import { RegisteredExamsComponent } from './components/registered-exams/registered-exams.component';
import { UserDetailsComponent } from './components/user-details/user-details.component';

@NgModule({
  declarations: [
    AppComponent,
    AuthComponent,
    SignupFormComponent,
    LoginFormComponent,
    ExamsComponent,
    ExamCardComponent,
    ExamDetailsComponent,
    HeaderComponent,
    PaymentComponent,
    AddExamComponent,
    PaymentSlipComponent,
    VerificationComponent,
    RegisteredExamsComponent,
    UserDetailsComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    AppRoutingModule,
    CommonModule,
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
