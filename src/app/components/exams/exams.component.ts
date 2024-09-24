import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Exam } from '../../model/exam';
import { ExamService } from '../../services/exam.service';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { SweetalertService } from '../../services/sweetalert.service'; // Importuj SweetAlert servis

@Component({
  selector: 'app-exams',
  templateUrl: './exams.component.html',
  styleUrls: ['./exams.component.css']
})
export class ExamsComponent implements OnInit, OnDestroy {

  isAdmin = false;
  selectedExams: Exam[] = [];
  exams: Exam[];
  private examsSubscription: Subscription;

  constructor(
    private examsService: ExamService,
    private router: Router,
    private authService: AuthService,
    private examService: ExamService,
    private sweetalertService: SweetalertService // Dodaj SweetAlert servis
  ) {}

  ngOnInit(): void {
    this.examsSubscription = this.examsService.exams$.subscribe(exams => {
      this.exams = exams;
    });
    this.authService.isUserAdmin$.subscribe(isAdmin => {
      this.isAdmin = isAdmin;
    });
  }

  ngOnDestroy(): void {
    this.examsSubscription?.unsubscribe();
  }

  isSelected(exam: Exam): boolean {
    return this.selectedExams.includes(exam);
  }

  toggleSelection(exam: Exam): void {
    if (this.isAdmin) {
      this.examService.currentExam = exam;
      this.router.navigate([`/exams/${exam.id}`]);
      return;
    }
    const index = this.selectedExams.indexOf(exam);

    if (index > -1) {
      this.selectedExams.splice(index, 1);
    } else {
      this.selectedExams.push(exam);
    }
  }

  payWithPaypal(): void {
    if (this.selectedExams.length === 0) {
      this.sweetalertService.showError('Morate odabrati bar 1 ispit', 'Greška'); // Zamena alert-a sa stilizovanim notifikacijama
      return;
    }
    this.examService.selectedExams = this.selectedExams;
    this.router.navigate(['/payment']);
  }

  generatePaymentSlip(): void {
    if (this.selectedExams.length === 0) {
      this.sweetalertService.showError('Morate odabrati bar 1 ispit', 'Greška'); // Zamena alert-a sa stilizovanim notifikacijama
      return;
    }
    this.examService.selectedExams = this.selectedExams;
    this.router.navigate(['/paymentslip']);
  }
}
