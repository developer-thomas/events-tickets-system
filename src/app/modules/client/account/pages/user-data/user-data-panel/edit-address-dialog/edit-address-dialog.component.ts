import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { FormsModule, ReactiveFormsModule, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';

interface Address {
  street: string
  number: string
  complement: string
  zipCode: string
  city: string
  state: string
}

@Component({
  selector: 'app-edit-address-dialog',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
  ],
  templateUrl: './edit-address-dialog.component.html',
  styleUrl: './edit-address-dialog.component.scss'
})
export class EditAddressDialogComponent {
  addressForm: FormGroup;

  constructor(
    public dialogRef: MatDialogRef<EditAddressDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { address: Address },
    private fb: FormBuilder
  ) {
    this.addressForm = this.fb.group({
      street: [data.address.street, Validators.required],
      number: [data.address.number, Validators.required],
      complement: [data.address.complement],
      zipCode: [data.address.zipCode, Validators.required],
      city: [data.address.city, Validators.required],
      state: [data.address.state, Validators.required],
    })
  }

  onCancel(): void {
    this.dialogRef.close()
  }

  onSubmit(): void {
    if (this.addressForm.valid) {
      this.dialogRef.close(this.addressForm.value)
    }
  }
}
