import { CommonModule } from '@angular/common';
import { Component, inject, Input } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { QrCode } from '../../../models/GetTicketById.interface';
import { MatDialog } from '@angular/material/dialog';
import { QrcodeVisibilityComponent } from './qrcode-visibility/qrcode-visibility.component';

@Component({
  selector: 'app-qr-codes-view',
  standalone: true,
  imports: [CommonModule, MatIconModule, MatButtonModule],
  templateUrl: './qr-codes-view.component.html',
  styleUrl: './qr-codes-view.component.scss'
})
export class QrCodesViewComponent {
  private dialog = inject(MatDialog);

  @Input() qrCode!: QrCode | undefined; 
  @Input() eventName!: string | undefined;
  @Input() eventDate!: any;

  viewTicket() {
    if (!this.qrCode) return;

    this.dialog.open(QrcodeVisibilityComponent, {
      data: {
        qrCode: this.qrCode,
        qrCodeImage: this.qrCode.qrcode,
        eventName: this.eventName,
        eventDate: this.eventDate,
      },
      width: '400px'
    });
  }

  downloadTicket() {
    if (!this.qrCode) return;

    const printWindow = window.open('', 'Print-Window');
    if (!printWindow) return;

    printWindow.document.write(`
      <html>
        <head>
          <title>Imprimir QR Code</title>
          <style>
            body { font-family: Arial, sans-serif; text-align: center; padding: 20px; }
            img { width: 200px; height: 200px; }
            .details { margin-top: 20px; font-size: 16px; }
          </style>
        </head>
        <body>
          <img src="${this.qrCode.qrcode}" alt="QR Code" />
          <div class="details">
            <p><strong>Código:</strong> ${this.qrCode.id}</p>
            <p><strong>Evento:</strong> ${this.eventName}</p>
            <p><strong>Data:</strong> ${new Date(this.eventDate).toLocaleDateString()}</p>
          </div>
          <script>
            window.onload = function() {
              window.print();
              window.close();
            }
          </script>
        </body>
      </html>
    `);
    printWindow.document.close();
  
  }
}
