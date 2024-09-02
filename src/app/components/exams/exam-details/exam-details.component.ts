import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Exam } from '../../../model/exam';
import { ExamService } from "../../../services/exam.service";

@Component({
  selector: 'app-exam-details',
  templateUrl: './exam-details.component.html',
  styleUrls: ['./exam-details.component.css']
})
export class ExamDetailsComponent implements OnInit {

  exam: Exam;
  constructor(private route: ActivatedRoute, private examsService: ExamService, private router: Router) {}

  ngOnInit(): void {
    const examId: number = +this.route.snapshot.paramMap.get('id');
    this.exam = this.examsService.getExamById(examId);
  }

  proceedToPayment(): void{
    this.examsService.currentExam = this.exam;
    this.router.navigate(['/payment']);
  }

}
