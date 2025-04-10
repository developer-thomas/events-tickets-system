import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { FormsModule, ReactiveFormsModule, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-change-email-dialog',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
  ],
  templateUrl: './change-email-dialog.component.html',
  styleUrl: './change-email-dialog.component.scss'
})
export class ChangeEmailDialogComponent {
  emailForm: FormGroup;

  constructor(
    public dialogRef: MatDialogRef<ChangeEmailDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { currentEmail: string },
    private fb: FormBuilder
  ) {
    this.emailForm = this.fb.group({
      newEmail: ["", [Validators.required, Validators.email]],
      confirmEmail: ["", [Validators.required]],
    }, { validator: this.checkEmails })
  }

  checkEmails(group: FormGroup) {
    const newEmail = group.get("newEmail")?.value
    const confirmEmail = group.get("confirmEmail")?.value

    return newEmail === confirmEmail ? null : { mismatch: true }
  }

  onCancel(): void {
    this.dialogRef.close()
  }

  onSubmit(): void {
    if (this.emailForm.valid) {
      this.dialogRef.close(this.emailForm.get("newEmail")?.value)
    }
  }
}
