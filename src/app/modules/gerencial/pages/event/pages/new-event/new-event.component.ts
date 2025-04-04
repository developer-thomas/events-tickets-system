import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';
import { PageHeaderComponent } from '../../../../../shared/components/page-header/page-header.component';
import { StepOneComponent } from './components/step-one/step-one.component';
import { StepThreeComponent } from './components/step-three/step-three.component';
import { StepTwoComponent } from './components/step-two/step-two.component';

@Component({
  selector: 'app-new-event',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatIconModule,
    PageHeaderComponent,
    StepOneComponent,
    StepTwoComponent,
    StepThreeComponent,],
  templateUrl: './new-event.component.html',
  styleUrl: './new-event.component.scss'
})
export class NewEventComponent {
  currentStep = 1
  totalSteps = 3
  eventForm: FormGroup

  constructor(
    private fb: FormBuilder,
    private router: Router,
  ) {
    this.eventForm = this.fb.group({
      // Step 1 - Event Data
      eventName: ["", Validators.required],
      locationId: ["", Validators.required],
      description: ["", Validators.required],
      startDate: ["", Validators.required],
      endDate: ["", Validators.required],
      price: ["", Validators.required],
      ticketQuantity: ["", [Validators.required, Validators.min(1)]],
      categories: [[]],
      coverImage: [null],

      // Step 2 - Schedule (will be expanded later)
      schedule: this.fb.group({}),

      // Step 3 - Sponsors (will be expanded later)
      sponsors: this.fb.group({}),
    })
  }

  ngOnInit(): void {}

  nextStep(): void {
    if (this.currentStep < this.totalSteps) {
      // Validate current step before proceeding
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
      const step1Controls = [
        "eventName",
        "locationId",
        "description",
        "startDate",
        "endDate",
        "price",
        "ticketQuantity",
      ]
      return this.validateControls(step1Controls)
    } else if (this.currentStep === 2) {
      const scheduleGroup = this.eventForm.get("schedule") as FormGroup
      return scheduleGroup.valid
    } else if (this.currentStep === 3) {
      const sponsorsGroup = this.eventForm.get("sponsors") as FormGroup
      return sponsorsGroup.valid
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
      // Submit form data to backend
      this.router.navigate(["/gerencial/evento"])
    } else {
      // Mark all fields as touched to trigger validation messages
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
    this.router.navigate(["/gerencial/evento"])
  }
}
