import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogActions, MatDialogContent, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-qrcode-visibility',
  standalone: true,
  imports: [CommonModule, MatDialogActions, MatDialogContent],
  template: `
    <mat-dialog-content class="modal-content">
      <img [src]="data.qrCodeImage" alt="QR Code" class="qr-expanded" />
      <div class="ticket-details">
        <p><strong>Código:</strong> {{ data.qrCode.id }}</p>
        <p><strong>Evento:</strong> {{ data.eventName }}</p>
        <p><strong>Data:</strong> {{ data.eventDate | date:'dd/MM/yyyy' }}</p>
        <!-- outros detalhes que quiser mostrar -->
      </div>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button (click)="close()">Fechar</button>
    </mat-dialog-actions>
  `,
  styles: `
     .qr-expanded {
      width: 200px;
      height: 200px;
      display: block;
      margin: 0 auto 16px auto;
    }
    .ticket-details {
      text-align: center;
      font-size: 14px;
      color: #444;
    }
  `,

})
export class QrcodeVisibilityComponent { 
  constructor(
    public dialogRef: MatDialogRef<QrcodeVisibilityComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  close() {
    this.dialogRef.close();
  }
}
