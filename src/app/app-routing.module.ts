import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthComponent } from './components/login/auth.component';
import { ExamsComponent } from "./components/exams/exams.component";
import { ExamDetailsComponent } from "./components/exams/exam-details/exam-details.component";
import { PaymentComponent } from "./components/payment/payment.component";
import { AuthGuard } from './guards/auth.guard';
import { AddExamComponent } from './components/exams/add-exam/add-exam.component';
import { PaymentSlipComponent } from './components/payment-slip/payment-slip.component';
import { VerificationComponent } from './components/verification/verification.component';
import { RegisteredExamsComponent } from './components/registered-exams/registered-exams.component';
import { LoggedInGuard } from './guards/logged-in.guard';

const routes: Routes = [
  { path: '', redirectTo: '/auth', pathMatch: 'full'},
  { path: 'auth', component: AuthComponent, canActivate: [LoggedInGuard] },
  { path: 'verification/:token', component: VerificationComponent,  canActivate: [LoggedInGuard]   },
  { path: 'exams', component: ExamsComponent, canActivate: [AuthGuard] },
  { path: 'exams/:id', component: ExamDetailsComponent, canActivate: [AuthGuard]},
  { path: 'payment', component: PaymentComponent, canActivate: [AuthGuard]},
  { path: 'paymentslip', component: PaymentSlipComponent, canActivate: [AuthGuard]},
  { path: 'add-exam', component: AddExamComponent, canActivate: [AuthGuard]},
  { path: 'myExams', component: RegisteredExamsComponent, canActivate: [AuthGuard]},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
