import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { NgxMaskDirective } from 'ngx-mask';

@Component({
  selector: 'app-step-two',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatInputModule, MatFormFieldModule, MatIconModule, MatButtonModule, NgxMaskDirective],
  templateUrl: './step-two.component.html',
  styleUrl: './step-two.component.scss'
})
export class StepTwoComponent implements OnInit {
  @Input() formGroup!: FormGroup
  hidePassword = true

  ngOnInit(): void {
    // Initialize representative form group if not already done
    if (!this.formGroup.get("representative")) {
      const representativeGroup = new FormGroup({
        name: new FormControl("", Validators.required),
        taxId: new FormControl("", Validators.required),
        email: new FormControl("", [Validators.required, Validators.email]),
        password: new FormControl("", [Validators.required, Validators.minLength(6)]),
        phone: new FormControl("", Validators.required),
      })

      this.formGroup.setControl("representative", representativeGroup)
    }
  }

  // Helper method to get form control with proper typing
  getFormControl(name: string): FormControl {
    return this.formGroup.get("representative")?.get(name) as FormControl
  }

  togglePasswordVisibility(): void {
    this.hidePassword = !this.hidePassword
  }
}
