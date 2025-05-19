import { Component, EventEmitter, inject, Output } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { AuthService } from '../../../../../../core/auth/auth.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-first-step',
  standalone: true,
  templateUrl: './first-step.component.html',
  styleUrl: './first-step.component.scss',
  imports: [
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
    MatButtonModule,
  ],
})
export class FirstStepComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private toastr = inject(ToastrService);

  @Output() nextStep = new EventEmitter<any>();

  public form = this.fb.group({
    email: [''],
  });

  onSubmit() {
    this.sendForgotPasswordRequest();    
  }

  sendForgotPasswordRequest() {
    const { email } = this.form.value;

    if(email) {
      this.authService.forgot(email).subscribe({
        next: (res) => {
          this.toastr.success("Código de alteração de senha enviado para o email.")
          console.log("Solicitação de reset de senha:", res);
          this.nextStep.emit();
        }
      })
    }
  }
}
