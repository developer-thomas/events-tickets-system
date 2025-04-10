import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { Router } from '@angular/router';
import { NgxMaskDirective } from 'ngx-mask';

type PaymentMethod = "pix" | "credit-card"

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    MatButtonModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    NgxMaskDirective,
  ],
  templateUrl: './checkout.component.html',
  styleUrl: './checkout.component.scss'
})
export class CheckoutComponent implements OnInit {
  private fb = inject(FormBuilder);
  private router = inject(Router);
  selectedPaymentMethod: PaymentMethod = "pix"
  creditCardForm: FormGroup
  totalAmount = "R$ 00,00"

  constructor() {
    this.creditCardForm = this.fb.group({
      cardName: ["", Validators.required],
      cardNumber: ["", [Validators.required, Validators.pattern(/^\d{16}$/)]],
      expiryDate: ["", [Validators.required, Validators.pattern(/^\d{2}\/\d{2}$/)]],
      cvv: ["", [Validators.required, Validators.pattern(/^\d{3}$/)]],
      cpf: ["", [Validators.required, Validators.pattern(/^\d{9}-\d{2}$/)]],
      birthDate: ["", [Validators.required, Validators.pattern(/^\d{2}\/\d{2}\/\d{4}$/)]],
      paymentForm: ["À vista - Até 0% de desconto - R$ 00,00"],
    })
  }

  ngOnInit(): void {}

  selectPaymentMethod(method: PaymentMethod): void {
    this.selectedPaymentMethod = method
  }

  goBack(): void {
    window.history.back()
  }

  processPayment(): void {
    if (this.selectedPaymentMethod === "credit-card" && !this.creditCardForm.valid) {
      this.creditCardForm.markAllAsTouched()
      return
    }

    // Process payment logic would go here
    console.log("Processing payment with method:", this.selectedPaymentMethod)
    if (this.selectedPaymentMethod === "credit-card") {
      console.log("Credit card details:", this.creditCardForm.value)
    }

    // Navigate to confirmation page or back to events
    // this.router.navigate(['/payment/confirmation']);
  }
}
