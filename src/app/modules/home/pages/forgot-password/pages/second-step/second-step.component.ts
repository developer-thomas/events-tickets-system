import { Component, EventEmitter, inject, Output } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { AuthService } from '../../../../../../core/auth/auth.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-second-step',
  standalone: true,
  templateUrl: './second-step.component.html',
  styleUrl: './second-step.component.scss',
  imports: [
    MatInputModule,
    MatFormFieldModule,
    MatButtonModule,
    MatIconModule,
    ReactiveFormsModule,
  ],
})
export class SecondStepComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private toastr = inject(ToastrService);

  @Output() resetPassword = new EventEmitter<any>();

  hide = true;
  form = this.fb.group({
    code: ['', [Validators.required]],
    password: ['', [Validators.required]],
    confirmPassword: ['', [Validators.required]],
  });

  onSubmit() {
    this.resetPasswordRequest()
  }

  resetPasswordRequest() {
    const { code, password, confirmPassword } = this.form.value;

    if(code && password && confirmPassword) {
      this.authService.reset({ code, password, confirmPassword }).subscribe({
        next: (_) => {
          this.toastr.success("Senha alterada com sucesso!");
          this.resetPassword.emit();
        }, error: (err) => {
          console.error(err)
        }
      })
    }
  }
}
