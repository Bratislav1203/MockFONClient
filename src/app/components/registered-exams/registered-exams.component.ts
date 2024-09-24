import { Component, OnDestroy, OnInit } from '@angular/core';
import { Exam } from '../../model/exam';
import { ExamService } from '../../services/exam.service';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { Subscription } from 'rxjs';
import { SweetalertService } from '../../services/sweetalert.service'; // Importuj SweetAlert servis

@Component({
  selector: 'app-registered-exams',
  templateUrl: './registered-exams.component.html',
  styleUrls: ['./registered-exams.component.css']
})
export class RegisteredExamsComponent implements OnInit, OnDestroy {

  selectedExam: Exam | null = null; // Pamti samo jedan selektovani ispit
  exams: Exam[];
  private examsSubscription: Subscription;

  constructor(
    private examsService: ExamService,
    private router: Router,
    private authService: AuthService,
    private examService: ExamService,
    private sweetalertService: SweetalertService // Dodaj SweetAlert servis
  ) {
    examService.loadUserExams();
  }

  ngOnInit(): void {
    this.examsSubscription = this.examsService.userExams$.subscribe(exams => {
      this.exams = exams;
    });
  }

  ngOnDestroy(): void {
    this.examsSubscription?.unsubscribe();
  }

  isSelected(exam: Exam): boolean {
    return this.selectedExam === exam;
  }

  toggleSelection(exam: Exam): void {
    if (this.selectedExam === exam) {
      this.selectedExam = null;
    } else {
      this.selectedExam = exam;
    }
  }

  deleteRegistration(): void {
    if (this.selectedExam) {
      const examDate = new Date(this.selectedExam.date);
      const today = new Date();

      const timeDifference = examDate.getTime() - today.getTime();
      const daysDifference = Math.ceil(timeDifference / (1000 * 3600 * 24));

      // Provera da li je ispit za manje od 5 dana
      if (daysDifference < 5) {
        this.sweetalertService.showError('Ne možete obrisati rezervaciju jer je ispit za manje od 5 dana.', 'Greška');
        return;
      }

      // Prikaz potvrde sa stilizovanim SweetAlert2 dijalogom
      this.sweetalertService.showConfirmDialog(
        `Da li ste sigurni da želite da obrišete rezervaciju za ispit?`,
        'Potvrda brisanja'
      ).then((confirmed) => {
        if (confirmed) {
          const email = this.authService.getEmail();
          this.examService.deleteReservation(this.selectedExam.id, email).subscribe({
            next: () => {
              this.sweetalertService.showSuccess('Rezervacija je uspešno obrisana.');
              this.selectedExam = null;
              this.examsService.loadUserExams();
            },
            error: (error) => {
              if (error.status === 200){
                this.sweetalertService.showSuccess('Rezervacija je uspešno obrisana.');
                this.selectedExam = null;
                this.examsService.loadUserExams();
                return;
              }
              console.error('Greška prilikom brisanja rezervacije:', error);
              this.sweetalertService.showError('Došlo je do greške prilikom brisanja rezervacije.', 'Greška');
            }
          });
        }
      });
    }
  }
}
