import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';
import { Router } from '@angular/router';
import { PageHeaderComponent } from '../../../../../shared/components/page-header/page-header.component';
import { StepOneComponent } from './components/step-one/step-one.component';
import { StepTwoComponent } from './components/step-two/step-two.component';
import { NgxMaskDirective, NgxMaskPipe } from 'ngx-mask';

@Component({
  selector: 'app-new-event',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatInputModule,
    MatFormFieldModule,
    MatButtonModule,
    MatIconModule,
    MatRadioModule,
    PageHeaderComponent,
    StepOneComponent,
    StepTwoComponent,
  ],
  templateUrl: './new-event.component.html',
  styleUrl: './new-event.component.scss',
})
export class NewEventComponent implements OnInit {
  currentStep = 1
  totalSteps = 2
  eventForm: FormGroup

  constructor(
    private fb: FormBuilder,
    private router: Router,
  ) {
    this.eventForm = this.fb.group({
      // Dados do Local
      locationName: ["", Validators.required],
      description: ["", Validators.required],
      categories: [[]],
      coverImage: [null],
      logoImage: [null],
      locationLink: [""],

      // Representante
      representative: this.fb.group({
        name: ["", Validators.required],
        taxId: ["", Validators.required],
        email: ["", [Validators.required, Validators.email]],
        password: ["", [Validators.required, Validators.minLength(6)]],
      }),
    })
  }

  ngOnInit(): void {}

  nextStep(): void {
    if (this.currentStep < this.totalSteps) {
      if (this.validateCurrentStep()) {
        this.currentStep++
      }
    } else {
      this.submitForm()
    }
  }

  previousStep(): void {
    if (this.currentStep > 1) {
      this.currentStep--
    }
  }

  validateCurrentStep(): boolean {
    if (this.currentStep === 1) {
      const step1Controls = ["locationName", "description"]
      return this.validateControls(step1Controls)
    } else if (this.currentStep === 2) {
      const representativeGroup = this.eventForm.get("representative") as FormGroup
      return representativeGroup.valid
    }
    return true
  }

  validateControls(controlNames: string[]): boolean {
    let valid = true
    for (const name of controlNames) {
      const control = this.eventForm.get(name)
      if (control && control.invalid) {
        control.markAsTouched()
        valid = false
      }
    }
    return valid
  }

  submitForm(): void {
    if (this.eventForm.valid) {
      console.log("Form submitted:", this.eventForm.value)
      this.router.navigate(["/gerencial/local"])
    } else {
      this.markFormGroupTouched(this.eventForm)
    }
  }

  // Helper method to mark all controls as touched
  private markFormGroupTouched(formGroup: FormGroup): void {
    Object.values(formGroup.controls).forEach((control) => {
      control.markAsTouched()

      if ((control as any).controls) {
        this.markFormGroupTouched(control as FormGroup)
      }
    })
  }

  cancel(): void {
    this.router.navigate(["/gerencial/local"])
  }
}
