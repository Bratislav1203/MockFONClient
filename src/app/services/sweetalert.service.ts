// sweetalert.service.ts
import { Injectable } from '@angular/core';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class SweetalertService {

  // Postojeće metode za uspeh, grešku, upozorenje, informaciju
  showSuccess(message: string, title: string = 'Uspeh') {
    Swal.fire({
      icon: 'success',
      title,
      text: message,
      confirmButtonText: 'U redu',
      confirmButtonColor: '#3085d6'
    });
  }

  showError(message: string, title: string = 'Greška') {
    Swal.fire({
      icon: 'error',
      title,
      text: message,
      confirmButtonText: 'Zatvori',
      confirmButtonColor: '#d33'
    });
  }

  showWarning(message: string, title: string = 'Upozorenje') {
    Swal.fire({
      icon: 'warning',
      title,
      text: message,
      confirmButtonText: 'Razumem',
      confirmButtonColor: '#f39c12'
    });
  }

  showInfo(message: string, title: string = 'Informacija') {
    Swal.fire({
      icon: 'info',
      title,
      text: message,
      confirmButtonText: 'U redu',
      confirmButtonColor: '#3085d6'
    });
  }

  showConfirmDialog(
    message: string,
    title: string = 'Da li ste sigurni?',
    confirmButtonText: string = 'Potvrdi',
    cancelButtonText: string = 'Otkaži'
  ): Promise<boolean> {
    return Swal.fire({
      title,
      text: message,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText,
      cancelButtonText,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33'
    }).then((result) => {
      return result.isConfirmed;
    });
  }
}
