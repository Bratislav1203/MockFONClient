import { Component, OnInit } from '@angular/core';
import { Observable, Subscription } from "rxjs";
import { Exam } from "../../model/exam";
import { ExamService } from "../../services/exam.service";

@Component({
  selector: 'app-exams',
  templateUrl: './exams.component.html',
  styleUrls: ['./exams.component.css']
})
export class ExamsComponent implements OnInit {

  exams: Exam[];
  private examsSubscription: Subscription;

  constructor(private examsService: ExamService) {
  }

  ngOnInit(): void {
    this.examsSubscription = this.examsService.examsSubject.subscribe(exams => {
      this.exams = exams;
    });
  }

  ngOnDestroy(): void {
    this.examsSubscription?.unsubscribe();
  }

}
