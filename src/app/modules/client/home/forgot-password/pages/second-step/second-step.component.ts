import { Component, EventEmitter, inject, Output } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { AuthService } from '../../../../../../core/auth/auth.service';
import { ToastrService } from 'ngx-toastr';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-second-step',
  standalone: true,
  imports: [
    MatInputModule,
    MatFormFieldModule,
    MatButtonModule,
    MatIconModule,
    ReactiveFormsModule,
    CommonModule
  ],
  templateUrl: './second-step.component.html',
  styleUrl: './second-step.component.scss'
})
export class SecondStepComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private toastr = inject(ToastrService);

  @Output() resetPassword = new EventEmitter<any>();

  hide = true;
  form = this.fb.group({
    code: ['', [Validators.required]],
    password: ['', [Validators.required, Validators.minLength(8)]],
    confirmPassword: ['', [Validators.required]],
  });

  onSubmit() {
    if (this.form.valid) {
      this.resetPasswordRequest();
    } else {
      this.markFormGroupTouched(this.form);
    }
  }

  resetPasswordRequest() {
    const { code, password, confirmPassword } = this.form.value;

    if(code && password && confirmPassword) {
      // Validar se as senhas coincidem
      if (password !== confirmPassword) {
        this.toastr.error('As senhas não coincidem');
        return;
      }

      this.authService.reset({ code, password, confirmPassword }).subscribe({
        next: (_) => {
          this.toastr.success("Senha alterada com sucesso!");
          this.resetPassword.emit();
        }, 
        error: (err) => {
          console.error('Erro ao resetar senha:', err);
          this.toastr.error('Erro ao alterar senha');
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
