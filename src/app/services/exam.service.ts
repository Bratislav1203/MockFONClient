import { Injectable } from '@angular/core';
import { Exam } from '../model/exam';
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { AuthService } from './auth.service';
import { catchError, map, tap } from 'rxjs/operators';
import { User } from '../model/user';
import { SweetalertService } from './sweetalert.service'; // Importuj SweetAlert servis

@Injectable({
  providedIn: 'root'
})
export class ExamService {

  private examsSubject: BehaviorSubject<Exam[]> = new BehaviorSubject<Exam[]>([]);
  public exams$: Observable<Exam[]> = this.examsSubject.asObservable();
  private userExamsSubject: BehaviorSubject<Exam[]> = new BehaviorSubject<Exam[]>([]);
  public userExams$: Observable<Exam[]> = this.userExamsSubject.asObservable();
  private userSubject = new BehaviorSubject<User[]>([]);
  users$ = this.userSubject.asObservable();

  public currentExam;
  private baseUrl = 'http://localhost:8080/api/exams';

  constructor(
    private http: HttpClient,
    private authService: AuthService,
    private sweetalertService: SweetalertService // Dodaj SweetAlert servis
  ) {
    this.loadAllExams();
  }

  public selectedExams: Exam[];

  getExamById(id: number): Observable<Exam> {
    const headers = this.createHeaders();
    return this.http.get<Exam>(`${this.baseUrl}/${id}`, { headers }).pipe(
      map(exam => this.transformExam(exam)),
      catchError(error => {
        console.error('Error loading exams', error);
        return [];
      }),
    );
  }

  createExam(examData: any): Observable<any> {
    const headers = this.createHeaders();
    return this.http.post(this.baseUrl, examData, { headers });
  }

  public loadAllExams(): void {
    const headers = this.createHeaders();
    this.http.get<Exam[]>(this.baseUrl, { headers }).pipe(
      map(exams => exams.map(exam => this.transformExam(exam))),
      catchError(error => {
        console.error('Error loading exams', error);
        return [];
      }),
      tap(exams => this.examsSubject.next(exams))
    ).subscribe();
  }

  private transformExam(serverExam: any): Exam {
    return new Exam(
      serverExam.examId,
      this.mapSubjectDisplayName(serverExam.examSubject),
      serverExam.dateAndTime[0] + '-' + this.padZero(serverExam.dateAndTime[1]) + '-' + this.padZero(serverExam.dateAndTime[2]), // YYYY-MM-DD
      this.padZero(serverExam.dateAndTime[3]) + ':' + this.padZero(serverExam.dateAndTime[4]), // HH:mm
      serverExam.price,
      `${serverExam.registrationStart[0]}-${this.padZero(serverExam.registrationStart[1])}-${this.padZero(serverExam.registrationStart[2])}`, // YYYY-MM-DD
      `${serverExam.registrationEnd[0]}-${this.padZero(serverExam.registrationEnd[1])}-${this.padZero(serverExam.registrationEnd[2])}` // YYYY-MM-DD
    );
  }

  private padZero(num: number): string {
    return num.toString().padStart(2, '0');
  }

  private mapSubjectDisplayName(subject: ExamSubject | string): string {
    switch (subject) {
      case 'MATH':
        return 'Matematika';
      case 'GENERAL_KNOWLEDGE':
        return 'Opšta informisanost';
      default:
        return subject as string;
    }
  }

  deleteExam(id: number): Observable<any> {
    const headers = this.createHeaders();
    return this.http.delete(`${this.baseUrl}/${id}`, { headers });
  }

  createExamRegistration(exams: Exam[], transactionDetails: { [key: number]: { transactionId: string, captureId: string } }, payerEmail): void {
    const headers = this.createHeaders();
    const payPalEmail = payerEmail;
    const usersEmail = this.authService.getEmail();

    exams.forEach((exam) => {
      const { transactionId, captureId } = transactionDetails[exam.id] || {};

      if (!transactionId || !captureId) {
        console.error(`Transaction details missing for exam: ${exam.subject}`);
        this.sweetalertService.showError(`Transakcijski podaci nisu dostupni za ispit: ${exam.subject}`, 'Greška');
        return;
      }

      const payload = {
        examId: exam.id,
        email: usersEmail,
        payPalEmail: payPalEmail,
        transactionId: transactionId,
        captureId: captureId,
      };

      this.http.post('http://localhost:8080/api/registrations', payload, { headers, responseType: 'text' }).subscribe({
        next: (response) => {
          console.log(`Registration successful for exam: ${exam.subject}`, response);
          this.sweetalertService.showSuccess(`Uspešno obavljena transakcija.`, 'Uspeh');
        },
        error: (error) => {
          console.error(`Error during registration for exam: ${exam.subject}`, error);
          this.sweetalertService.showError(`Došlo je do greške prilikom registracije za ispit "${exam.subject}".`, 'Greška');
        },
      });
    });
  }

  public loadUserExams(): void {
    const headers = this.createHeaders();
    const email = this.authService.getEmail();
    const encodedEmail = encodeURIComponent(email);

    this.http.get<Exam[]>(`http://localhost:8080/api/registrations?email=${encodedEmail}`, { headers }).pipe(
      map(exams => exams.map(exam => this.transformExam(exam))),
      catchError(error => {
        console.error('Error loading exams', error);
        return [];
      }),
      tap(exams => this.userExamsSubject.next(exams))
    ).subscribe();
  }

  deleteReservation(examId: number, email: string): Observable<void> {
    const headers = this.createHeaders();
    const params = new HttpParams()
      .set('email', email)
      .set('examId', examId.toString());

    return this.http.delete<void>(`http://localhost:8080/api/registrations`, { headers, params }).pipe(
      tap({
        next: () => {
          console.log('Reservation deleted successfully.');
        },
        error: (error) => {
          if (error.status !== 200) {
            console.error('Error deleting reservation:', error);
            this.sweetalertService.showError('Došlo je do greške prilikom otkazivanja rezervacije.', 'Greška');
          }
        },
      })
    );
  }

  getUsersForExam(examId: number): void {
    const headers = this.createHeaders();

    this.http.get<User[]>(`http://localhost:8080/api/registrations/${examId}/users`, { headers }).pipe(
      tap(users => this.userSubject.next(users)),
      catchError(error => {
        console.error('Greška prilikom dohvatanja korisnika:', error);
        this.userSubject.next([]);
        this.sweetalertService.showError('Greška prilikom dohvatanja korisnika.', 'Greška');
        return [];
      })
    ).subscribe();
  }

  private createHeaders(): HttpHeaders {
    return new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${this.authService.getToken()}`,
    });
  }
}

export enum ExamSubject {
  MATH = 'Matematika',
  GENERAL_KNOWLEDGE = 'Opšta Znanja'
}
