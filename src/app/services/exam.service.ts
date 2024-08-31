import { Injectable } from '@angular/core';
import { Exam } from "../model/exam";
import { BehaviorSubject, Observable } from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class ExamService {
  examsSubject = new BehaviorSubject<Exam[]>([
      new Exam(1, 'Matematika', '20.05.2024', '9:00',200, '01.05.2024', '15.05.2024'),
      new Exam(2, 'Fizika', '25.05.2024', '13:30', 200,'10.05.2024', '20.05.2024'),
      new Exam(3, 'Istorija', '22.05.2024', '10:00',300, '05.05.2024', '18.05.2024')
    ]
  );

  public currentExam: Exam;
   exams$: Observable<Exam[]> = this.examsSubject.asObservable();
  constructor() { }

  getExamById(id: number): Exam{
    return this.examsSubject.value.find(exam => exam.id === id);
  }
}
