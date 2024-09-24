import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { ActivatedRoute, Router } from '@angular/router';
import { SweetalertService } from '../../services/sweetalert.service'; // Importuj SweetAlert servis

@Component({
  selector: 'app-verification',
  templateUrl: './verification.component.html',
  styleUrls: ['./verification.component.css']
})
export class VerificationComponent implements OnInit {

  password = '';
  address  = '';
  umcn = '';

  constructor(
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute,
    private sweetalertService: SweetalertService
  ) {}

  ngOnInit(): void {
  }

  onSubmit(): void {
    // Provera da li su sva polja popunjena
    if (!this.password || !this.address || !this.umcn) {
      this.sweetalertService.showError('Sva polja moraju da se popune!', 'Greška');
      return;
    }

    // Provera da li UMCN ima 13 cifara
    const umcnRegex = /^\d{13}$/;
    if (!umcnRegex.test(this.umcn)) {
      this.sweetalertService.showError('UMCN mora biti 13-cifreni broj!', 'Greška');
      return;
    }

    const token = this.route.snapshot.paramMap.get('token');
    this.authService.verifyAccount(this.password, this.address, this.umcn, token).subscribe({
      next: (message) => {
        console.log(message);
        this.sweetalertService.showSuccess('Uspešno završena verifikacija. Sada možete da se ulogujete na vaš nalog.', 'Verifikacija uspešna');
        this.router.navigate(['/login']); // Preusmeravanje na stranicu za prijavu nakon uspešne verifikacije
      },
      error: (error) => {
        console.error('Verification error:', error);
        this.sweetalertService.showError('Neuspešna verifikacija!', 'Greška');
      }
    });
  }
}
