import { Component, Input, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Exam } from '../../model/exam';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { ExamService } from '../../services/exam.service';

@Component({
  selector: 'app-payment-slip',
  templateUrl: './payment-slip.component.html',
  styleUrls: ['./payment-slip.component.css']
})
export class PaymentSlipComponent implements OnInit {

  selectedExams: Exam[]
  price: number = 0;
  payer;
  recipient;
  purposeOfPayment;
  paymentCode;
  amount;
  recipientAccount;
  model;
  referenceNumber;

  constructor(private authService: AuthService, private examService: ExamService) {
    this.selectedExams = examService.selectedExams;
    this.selectedExams.forEach(exam => {
      this.price += exam.price;
    });
  }
  ngOnInit(): void {
    this.payer = this.authService.getNameAndSurname();
    this.recipient = 'Fakultet organizacionih nauka, Jove Ilica 155, 11000 Beograd';
    this.purposeOfPayment = 'Uplata probnog prijemnog ispita';
    this.paymentCode = '189';
    this.amount = this.price;
    this.recipientAccount = '255-44213213912-360';
    this.model = '97';
    this.referenceNumber = this.createReferenceNumber(this.authService.getUmcn());
  }

  createReferenceNumber(umcn: string): string {
    const now = new Date();
    const day = String(now.getDate()).padStart(2, '0');
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const hour = String(now.getHours()).padStart(2, '0');
    const minute = String(now.getMinutes()).padStart(2, '0');

    return `${day}${month}${hour}${minute}${umcn}`;
  }


  downloadPDF(): void {
    const element = document.getElementById('uplatnica');
    setTimeout(() => {
      html2canvas(element).then(canvas => {
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF();
        const imgWidth = 210;
        const pageHeight = 295;
        const imgHeight = (canvas.height * imgWidth) / canvas.width;
        let heightLeft = imgHeight;
        let position = 0;

        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;

        while (heightLeft >= 0) {
          position = heightLeft - imgHeight;
          pdf.addPage();
          pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
          heightLeft -= pageHeight;
        }

        pdf.save('uplatnica.pdf');
      });
    }, 500); // Čeka 500ms da se podaci ažuriraju
  }

}
