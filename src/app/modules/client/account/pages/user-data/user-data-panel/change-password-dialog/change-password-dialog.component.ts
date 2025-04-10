import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
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
  passwordForm: FormGroup
  hideCurrentPassword = true
  hideNewPassword = true
  hideConfirmPassword = true

  constructor(
    public dialogRef: MatDialogRef<ChangePasswordDialogComponent>,
    private fb: FormBuilder,
  ) {
    this.passwordForm = this.fb.group(
      {
        currentPassword: ["", Validators.required],
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
      this.dialogRef.close(true)
    }
  }
}
