import { Injectable } from '@angular/core';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class ConfirmDialogService {

  confirm(title: string, text: string, confirmButtonText = 'Sim', cancelButtonText = 'Cancelar'): Promise<boolean> {
    return Swal.fire({
      title,
      text,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText,
      cancelButtonText
    }).then((result) => result.isConfirmed);
  }

}
