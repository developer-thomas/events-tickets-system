import { Component, EventEmitter, inject, Output } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-second-step',
  standalone: true,
  imports: [
    MatInputModule,
    MatFormFieldModule,
    MatButtonModule,
    MatIconModule,
    ReactiveFormsModule,
  ],
  templateUrl: './second-step.component.html',
  styleUrl: './second-step.component.scss'
})
export class SecondStepComponent {
private fb = inject(FormBuilder);

  @Output() resetPassword = new EventEmitter<any>();

  hide = true;
  form = this.fb.group({
    code: ['', [Validators.required]],
    password: ['', [Validators.required]],
    confirmPassword: ['', [Validators.required]],
  });

  onSubmit() {
    this.resetPassword.emit();
  }
}
