import { Component } from '@angular/core';
import { Exam } from '../../../model/exam';
import { ExamService } from '../../../services/exam.service';
import { SweetalertService } from '../../../services/sweetalert.service'; // Importuj SweetAlert servis

@Component({
  selector: 'app-add-exam',
  templateUrl: './add-exam.component.html',
  styleUrls: ['./add-exam.component.css']
})
export class AddExamComponent {

  constructor(
    private examService: ExamService,
    private sweetalertService: SweetalertService // Dodaj SweetAlert servis
  ) { }

  // @ts-ignore
  exam = new Exam('', '', '', '', '', '');

  onSubmit(): void {
    // Provera da li su sva polja popunjena
    if (!this.exam.subject || !this.exam.date || !this.exam.time || !this.exam.registrationStart || !this.exam.registrationEnd) {
      this.sweetalertService.showError('Sva polja moraju biti popunjena.', 'Greška');
      return;
    }

    const examDateTime = new Date(`${this.exam.date}T${this.exam.time}`);

    // Provera da li je datum ispita u budućnosti
    if (examDateTime <= new Date()) {
      this.sweetalertService.showError('Datum i vreme ispita moraju biti u budućnosti.', 'Greška');
      return;
    }

    // Provera da li je datum početka registracije pre datuma završetka
    if (new Date(this.exam.registrationStart) >= new Date(this.exam.registrationEnd)) {
      this.sweetalertService.showError('Datum početka registracije mora biti pre datuma završetka registracije.', 'Greška');
      return;
    }

    // Provera da li je datum završetka registracije najmanje 5 dana pre datuma ispita
    const fiveDaysBeforeExam = new Date(examDateTime);
    fiveDaysBeforeExam.setDate(examDateTime.getDate() - 5);

    if (new Date(this.exam.registrationEnd) > fiveDaysBeforeExam) {
      this.sweetalertService.showError('Datum završetka registracije mora biti najmanje 5 dana pre datuma ispita.', 'Greška');
      return;
    }

    console.log(this.exam);
    this.examService.createExam(this.exam).subscribe({
      next: (response) => {
        this.examService.loadAllExams();
        this.sweetalertService.showSuccess('Ispit je uspešno kreiran!', 'Uspeh');
        console.log(response);
      },
      error: (error) => {
        this.sweetalertService.showError('Došlo je do greške pri kreiranju ispita.', 'Greška');
        console.error(error);
      }
    });
  }
}
