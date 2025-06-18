import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule, ReactiveFormsModule, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-change-password-dialog',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
  ],
  templateUrl: './change-password-dialog.component.html',
  styleUrl: './change-password-dialog.component.scss'
})
export class ChangePasswordDialogComponent {
  private fb = inject(FormBuilder)
  public dialogRef = inject(MatDialogRef<ChangePasswordDialogComponent>)

  passwordForm: FormGroup
  hideNewPassword = true
  hideConfirmPassword = true

  constructor() {
    this.passwordForm = this.fb.group(
      {
        newPassword: ["", [Validators.required, Validators.minLength(6)]],
        confirmPassword: ["", Validators.required],
      },
      { validator: this.checkPasswords },
    )
  }

  checkPasswords(group: FormGroup) {
    const newPassword = group.get("newPassword")?.value
    const confirmPassword = group.get("confirmPassword")?.value

    return newPassword === confirmPassword ? null : { mismatch: true }
  }

  onCancel(): void {
    this.dialogRef.close()
  }

  onSubmit(): void {
    if (this.passwordForm.valid) {
      // Retorna apenas a nova senha como string
      const newPassword = this.passwordForm.get("newPassword")?.value
      this.dialogRef.close(newPassword)
    }
  }
}
