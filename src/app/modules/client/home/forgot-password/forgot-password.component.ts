import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { SecondStepComponent } from './pages/second-step/second-step.component';
import { FirstStepComponent } from './pages/first-step/first-step.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [
    FirstStepComponent,
    SecondStepComponent,
    CommonModule
  ],
  templateUrl: './forgot-password.component.html',
  styleUrl: './forgot-password.component.scss'
})
export class ForgotPasswordComponent {
 private router = inject(Router);

  public step = 1;

  nextStep() {
    this.step++;
  }

  gotoLogin() {
    this.router.navigate(['/']);
  }
}
