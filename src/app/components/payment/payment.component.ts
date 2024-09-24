import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Exam } from '../../model/exam';
import { ExamService } from '../../services/exam.service';

declare var paypal: any;

@Component({
  selector: 'app-payment',
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.css']
})
export class PaymentComponent implements OnInit {

  @ViewChild('paypal', { static: true }) paypalElement: ElementRef;
  selectedExams: Exam[];
  price: number = 0;
  paidFor = false;

  // Objekat za čuvanje transakcijskih detalja za svaki ispit
  transactionDetails: { [key: number]: { transactionId: string, captureId: string } } = {};

  constructor(private examService: ExamService) {
    this.selectedExams = examService.selectedExams;
    this.selectedExams.forEach(exam => {
      this.price += exam.price;
    });
    this.price = parseFloat((this.price / 105).toFixed(2)); // Pretpostavlja se konverzija u USD
  }

  ngOnInit(): void {
    paypal
      .Buttons({
        createOrder: (data, actions) => {
          // Kreiranje purchase_units sa reference_id na osnovu ispita
          const purchaseUnits = this.selectedExams.map((exam) => {
            const price = parseFloat((exam.price / 105).toFixed(2));
            if (price <= 0) {
              console.error(`Invalid price for ${exam.subject}: ${price}`);
              throw new Error(`Invalid price for ${exam.subject}: ${price}`);
            }

            return {
              reference_id: `exam_${exam.id}`, // Dodavanje jedinstvenog reference_id
              description: `Ispit: ${exam.subject}`,
              amount: {
                currency_code: 'USD',
                value: price.toString(),
              },
            };
          });

          return actions.order.create({
            purchase_units: purchaseUnits,
          });
        },
        onApprove: async (data, actions) => {
          try {
            const order = await actions.order.capture(); // Hvata kompletan odgovor o narudžbini
            this.paidFor = true;

            order.purchase_units.forEach((unit, index) => {
              const transactionId = unit.payments.captures[0].id;
              const captureId = unit.payments.captures[0].id;
              const exam = this.selectedExams[index];

              // Povezuje `transactionId` i `captureId` sa specifičnim ispitom
              this.transactionDetails[exam.id] = { transactionId, captureId };
              console.log(`Transaction ID for ${exam.subject}:`, transactionId);
            });

            // Izdvajanje `email` korisnika iz odgovora
            const payerEmail = order.payer.email_address;
            console.log('Payer Email:', payerEmail);
            console.log('Transaction Details:', this.transactionDetails);

            // Prosleđivanje transakcijskih podataka za svaki ispit
            this.examService.createExamRegistration(this.selectedExams, this.transactionDetails, payerEmail);
          } catch (error) {
            console.error('Error capturing order:', error);
          }
        },
        onError: (err) => {
          console.log('Error during payment:', err);
        },
      })
      .render(this.paypalElement.nativeElement);
  }

}
