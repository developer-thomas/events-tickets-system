import { Component, EventEmitter, inject, Output } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { AuthService } from '../../../../../../core/auth/auth.service';
import { ToastrService } from 'ngx-toastr';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-first-step',
  standalone: true,
  imports: [
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
    MatButtonModule,
    CommonModule
  ],
  templateUrl: './first-step.component.html',
  styleUrl: './first-step.component.scss'
})
export class FirstStepComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private toastr = inject(ToastrService);

  @Output() nextStep = new EventEmitter<any>();

  public form = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
  });

  onSubmit() {
    if (this.form.valid) {
      this.sendForgotPasswordRequest();
    } else {
      this.markFormGroupTouched(this.form);
    }
  }

  sendForgotPasswordRequest() {
    const { email } = this.form.value;

    if(email) {
      this.authService.forgot(email).subscribe({
        next: (res) => {
          this.toastr.success("Código de alteração de senha enviado para o email.")
          console.log("Solicitação de reset de senha:", res);
          this.nextStep.emit();
        },
        error: (error) => {
          console.error('Erro ao enviar código de recuperação:', error);
          this.toastr.error('Erro ao enviar código de recuperação');
        }
      })
    }
  }

  // Helper method to mark all controls as touched
  private markFormGroupTouched(formGroup: any): void {
    Object.values(formGroup.controls).forEach((control: any) => {
      control.markAsTouched();

      if (control.controls) {
        this.markFormGroupTouched(control);
      }
    });
  }
}
