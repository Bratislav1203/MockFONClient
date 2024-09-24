import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Exam } from '../../../model/exam';
import { ExamService } from '../../../services/exam.service';
import { AuthService } from '../../../services/auth.service';
import { User } from '../../../model/user';
import autoTable from 'jspdf-autotable';
import jsPDF from 'jspdf';
import { SweetalertService } from '../../../services/sweetalert.service'; // Importuj SweetAlert servis

@Component({
  selector: 'app-exam-details',
  templateUrl: './exam-details.component.html',
  styleUrls: ['./exam-details.component.css']
})
export class ExamDetailsComponent implements OnInit {

  isAdmin = false;
  exam: Exam;
  users: User[] = [];
  searchTerm: string = '';

  constructor(
    private route: ActivatedRoute,
    private examService: ExamService,
    private router: Router,
    private authService: AuthService,
    private sweetalertService: SweetalertService // Dodaj SweetAlert servis
  ) {
    this.initializeExam().then(() => {
      this.initComponent();
    });
  }

  private async initializeExam(): Promise<void> {
    this.exam = this.examService.currentExam;

    if (!this.exam) {
      const examId = +this.route.snapshot.paramMap.get('id');
      await this.examService.getExamById(examId).toPromise().then((exam) => {
        this.exam = exam;
      }).catch((error) => {
        console.error('Došlo je do greške prilikom dohvatanja ispita:', error);
        this.router.navigate(['/exams']);
      });
    }
  }

  private initComponent(): void {
    this.authService.isUserAdmin$.subscribe(isAdmin => {
      this.isAdmin = isAdmin;
      if (!isAdmin) {
        this.router.navigate(['/exams']);
      }
    });

    this.examService.users$.subscribe(users => {
      this.users = users;
    });

    this.examService.getUsersForExam(this.exam.id);
  }

  ngOnInit(): void {
    // Pražan ngOnInit jer inicijalizacija ide preko `initComponent`
  }

  filteredUsers(): User[] {
    return this.users.filter(user => user.email.toLowerCase().includes(this.searchTerm.toLowerCase()));
  }

  unregisterUser(user: User): void {
    this.sweetalertService.showConfirmDialog(
      `Da li ste sigurni da želite da odjavite korisnika sa ispita ${this.exam.subject}?`,
      'Potvrda odjave'
    ).then((confirmed) => {
      if (confirmed) {
        this.examService.deleteReservation(this.exam.id, user.email).subscribe({
          next: () => {
            this.sweetalertService.showSuccess('Korisnik je uspešno odjavljen.');
            this.examService.getUsersForExam(this.exam.id);
          },
          error: (error) => {
            if (error.status === 200) {
              this.sweetalertService.showSuccess('Korisnik je uspešno odjavljen.');
              this.examService.getUsersForExam(this.exam.id);
              return;
            }
            console.error('Došlo je do greške prilikom odjavljivanja korisnika:', error);
            this.sweetalertService.showError('Došlo je do greške prilikom odjavljivanja korisnika.', 'Greška');
          }
        });
      }
    });
  }

  deleteExam(): void {
    this.sweetalertService.showConfirmDialog(
      'Da li zaista želite da obrišete ispit?',
      'Potvrda brisanja'
    ).then((confirmed) => {
      if (confirmed) {
        this.examService.deleteExam(this.exam.id).subscribe({
          next: () => {
            this.examService.loadAllExams();
            this.sweetalertService.showSuccess('Ispit je uspešno obrisan.');
            this.router.navigate(['/exams']);
          },
          error: (error) => {
            this.sweetalertService.showError('Došlo je do greške prilikom brisanja ispita.', 'Greška');
            console.error(error);
          }
        });
      }
    });
  }

  downloadUserList(): void {
    const doc = new jsPDF();
    doc.text('Lista prijavljenih korisnika', 10, 10);

    autoTable(doc, {
      head: [['Email', 'Ime', 'Prezime', 'Adresa']],
      body: this.filteredUsers().map(user => [user.email, user.name, user.surname, user.address])
    });

    doc.save('lista_prijavljenih_korisnika.pdf');
  }
}
