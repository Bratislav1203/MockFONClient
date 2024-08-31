import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthComponent } from "./components/login/auth.component";
import { ExamsComponent } from "./components/exams/exams.component";
import { ExamDetailsComponent } from "./components/exams/exam-details/exam-details.component";
import { PaymentComponent } from "./components/payment/payment.component";

const routes: Routes = [
  { path: '', redirectTo: '/auth', pathMatch: 'full'},
  { path: 'auth', component: AuthComponent },
  { path: 'exams', component: ExamsComponent },
  { path: 'exams/:id', component: ExamDetailsComponent},
  { path: 'payment', component: PaymentComponent},


];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
