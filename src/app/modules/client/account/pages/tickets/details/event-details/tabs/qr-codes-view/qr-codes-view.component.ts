import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

interface QrCode {
  id: number
  label: string
  code: string
  status: string
}

@Component({
  selector: 'app-qr-codes-view',
  standalone: true,
  imports: [CommonModule, MatIconModule, MatButtonModule],
  templateUrl: './qr-codes-view.component.html',
  styleUrl: './qr-codes-view.component.scss'
})
export class QrCodesViewComponent {
  @Input() qrCodes: QrCode[] = []

  // QR code image placeholder - in a real app, this would be generated based on the code
  qrCodeImage = 'assets/images/qr-code.png'
  viewTicket(ticketId: number): void {
    console.log("View ticket:", ticketId)
    // Implement view ticket logic
  }

  downloadTicket(ticketId: number): void {
    console.log("Download ticket:", ticketId)
    // Implement download ticket logic
  }
}
