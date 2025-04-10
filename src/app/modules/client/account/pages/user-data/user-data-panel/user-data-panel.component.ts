import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { ChangeEmailDialogComponent } from './change-email-dialog/change-email-dialog.component';
import { ChangePasswordDialogComponent } from './change-password-dialog/change-password-dialog.component';
import { EditAddressDialogComponent } from './edit-address-dialog/edit-address-dialog.component';

interface UserAddress {
  street: string
  number: string
  complement: string
  zipCode: string
  city: string
  state: string
}

@Component({
  selector: 'app-user-data-panel',
  standalone: true,
  imports: [CommonModule, MatIconModule, MatButtonModule, MatDialogModule, FormsModule, ReactiveFormsModule],
  templateUrl: './user-data-panel.component.html',
  styleUrl: './user-data-panel.component.scss'
})
export class UserDataPanelComponent {
  userData = {
    phone: "(00)00000-0000",
    name: "Exemplo preenchido",
    cpf: "000000000-00",
    gender: "Masculino",
    birthDate: "00/00/00",
    email: "mail@email.com",
  }

  userAddress: UserAddress = {
    street: "Rua Avenida Travessa",
    number: "Número",
    complement: "complemento",
    zipCode: "48970000",
    city: "Senhor do Bonfim",
    state: "BA",
  }

  constructor(private dialog: MatDialog) {}

  ngOnInit(): void {}

  openChangeEmailDialog(): void {
    const dialogRef = this.dialog.open(ChangeEmailDialogComponent, {
      width: "400px",
      height: "500px",
      data: { currentEmail: this.userData.email },
    })

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.userData.email = result
      }
    })
  }

  openChangePasswordDialog(): void {
    const dialogRef = this.dialog.open(ChangePasswordDialogComponent, {
      width: "400px",
      height: "500px"
    })

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        console.log("Password changed successfully")
      }
    })
  }

  openEditAddressDialog(): void {
    const dialogRef = this.dialog.open(EditAddressDialogComponent, {
      width: "500px",
      height: "500px",
      data: { address: this.userAddress },
    })

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.userAddress = result
      }
    })
  }

  saveChanges(): void {
    console.log("Saving changes...")
    // Implement save functionality
  }
}
