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
  qrCodeImage =
    "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAIQAAACECAYAAABRRIOnAAAAAklEQVR4AewaftIAAAOPSURBVO3BQY4cSRLAQDLQ//8yV0c/JZCoain2YjP7g7WWOFhrCYO1ljBYawmDtZYwWGsJg7WWMFhrCYO1ljBYawmDtZYwWGsJg7WWMFhrCYO1lvDhJZW/qeJE5aRiUnmq4kTlpuJE5W+qeMNgrSUM1lrCYK0lPHxZxTdVnKjcVJyoPFVxUnGiclNxUnGi8k0V3zRYawmDtZYwWGsJD7+k8kTFicpJxYnKTcWkclNxojKpTBUnKk9UPKHyRMVvGqy1hMFaSxistYSH/3MVk8pNxaRyU3Gi8kTF/7PBWksYrLWEwVpLePillX9TxYnKpDKpTConFZPKTcWJyhsV/6XBWksYrLWEwVpLePiyiv+SyknFicpJxaQyVUwqk8pJxaTyRsX/0mCtJQzWWsJgrSU8/JLKN6lMFZPKVDGpnFRMKicVk8pUMalMFZPKVDGpTBWTylTxTYO1ljBYawmDtZbw8FLFpDJVnKhMFZPKVHGiMlVMKlPFicpUcaIyVZyoTBWTylQxqUwVbxistYTBWksYrLWEh5dUpoqbiknlpGJSmSpOVKaKSeWkYlKZKiaVqWJSmSpOVKaKE5Wp4g2DtZYwWGsJg7WW8PCXVUwqU8WkMlVMKlPFpDJVTCpTxaQyVUwqU8WkMlVMKlPFpDJVTCpTxRsGay1hsNYSBmst4eHLVKaKSWWqmFROKiaVqWJSmSomlaniROWkYlKZKiaVqWJSmSomlaniDYO1ljBYawmDtZbw8GUqU8WkMlVMKlPFpDJVTCpTxaQyVUwqU8WkMlVMKlPFpDJVTCpTxaQyVbxhsNYSBmstYbDWEh5eUpkqJpWpYlKZKiaVqWJSmSomlaliUpkqJpWpYlKZKiaVqWJSmSomlaniDYO1ljBYawmDtZbw8JLK31QxqUwVk8pUMalMFZPKVDGpTBWTylQxqUwVk8pUMalMFW8YrLWEwVpLGKy1hIcvq/imiknlpGJSmSomlaliUpkqJpWpYlKZKiaVqWJSmSomlaniDYO1ljBYawmDtZbw8EsqT1ScqEwVk8pUMalMFZPKVDGpTBWTylQxqUwVk8pUMalMFZPKVPGbBmstYbDWEgZrLeHhP6ZiUpkqJpWpYlKZKiaVqWJSmSomlaliUpkqJpWp4g2DtZYwWGsJg7WW8PBLK/+miknlpGJSmSomlaliUpkqJpWpYlKZKiaVqeINg7WWMFhrCYO1lvDwZRV/08+KSeWkYlKZKiaVqWJSmSomlaniDYO1ljBYawmDtZbwB2stYbDWEgZrLWGw1hIGay1hsNYSBmstYbDWEgZrLWGw1hIGay1hsNYSBmstYbDWEgZrLeE/NQeCuqklRxQAAAAASUVORK5CYII="

  viewTicket(ticketId: number): void {
    console.log("View ticket:", ticketId)
    // Implement view ticket logic
  }

  downloadTicket(ticketId: number): void {
    console.log("Download ticket:", ticketId)
    // Implement download ticket logic
  }
}
