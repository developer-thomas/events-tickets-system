import { CommonModule } from '@angular/common';
import { Component, EventEmitter, inject, Output } from '@angular/core';
import { FormGroup, FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { NgxMaskDirective } from 'ngx-mask';

// CRIAR PASTA MODEL E ADICIONAR AS INTERFACES DE ACORDO COM A RESPOSTA DA API
export interface CouponData {
  code: string
  startDate: string
  expirationDate: string
  discount: number
  quantity: number
  eventId: string | null
}

interface Event {
  id: string
  name: string
}

@Component({
  selector: 'app-new-coupon',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatIconModule,
    MatInputModule,
    MatFormFieldModule,
    MatSelectModule,
    NgxMaskDirective,
  ],
  templateUrl: './new-coupon.component.html',
  styleUrl: './new-coupon.component.scss'
})
export class NewCouponComponent {
   dialog = inject(MatDialogRef<NewCouponComponent>)

  couponForm!: FormGroup

  @Output() save = new EventEmitter<CouponData>()
  @Output() cancel = new EventEmitter<void>()

  events: Event[] = [
    { id: "all", name: "Todos eventos" },
    { id: "1", name: "Evento 1" },
    { id: "2", name: "Evento 2" },
    { id: "3", name: "Evento 3" },
  ]

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.initForm()
  }

  initForm(): void {
    this.couponForm = this.fb.group({
      code: ["", Validators.required],
      startDate: ["", Validators.required],
      expirationDate: ["", Validators.required],
      discount: ["", [Validators.required, Validators.min(0), Validators.max(100)]],
      quantity: ["", [Validators.required, Validators.min(1)]],
      eventId: ["all"],
    })
  }

  onSubmit(): void {
    if (this.couponForm.valid) {
      const formValue = this.couponForm.value
      const couponData: CouponData = {
        code: formValue.code,
        startDate: formValue.startDate,
        expirationDate: formValue.expirationDate,
        discount: formValue.discount,
        quantity: formValue.quantity,
        eventId: formValue.eventId === "all" ? null : formValue.eventId,
      }
      this.save.emit(couponData)
    } else {

      this.markFormGroupTouched(this.couponForm)
    }
  }

  onCancel(): void {
    this.dialog.close();
  }

  private markFormGroupTouched(formGroup: FormGroup): void {
    Object.values(formGroup.controls).forEach((control) => {
      control.markAsTouched()
    })
  }
}
