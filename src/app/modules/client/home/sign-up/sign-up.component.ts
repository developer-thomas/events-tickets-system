import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ReactiveFormsModule, FormGroup, FormBuilder, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { RouterModule } from '@angular/router';
import { NgxMaskDirective } from 'ngx-mask';
import { ClientFooterComponent } from '../../../shared/components/client-footer/client-footer.component';
import { ClientHeaderComponent } from '../../../shared/components/client-header/client-header.component';

@Component({
  selector: 'app-sign-up',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatSelectModule,
    RouterModule,
    NgxMaskDirective,
    ClientHeaderComponent,
    ClientFooterComponent,
  ],
  templateUrl: './sign-up.component.html',
  styleUrl: './sign-up.component.scss'
})
export class SignUpComponent {
  signUpForm!: FormGroup
  profileImage: string | ArrayBuffer | null = null

  genderOptions = [
    { value: "masculino", label: "Masculino" },
    { value: "feminino", label: "Feminino" },
    { value: "outro", label: "Outro" },
    { value: "prefiro_nao_informar", label: "Prefiro não informar" },
  ]

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.signUpForm = this.fb.group(
      {
        fullName: ["", [Validators.required]],
        email: ["", [Validators.required, Validators.email]],
        birthDate: ["", [Validators.required]],
        phone: ["", [Validators.required]],
        // cpf: ["", [Validators.required]],
        gender: ["", [Validators.required]],
        password: ["", [Validators.required, Validators.minLength(8), this.passwordValidator]],
        confirmPassword: ["", [Validators.required]],
      },
      {
        validators: this.passwordMatchValidator,
      },
    )
  }

  passwordValidator(control: AbstractControl): ValidationErrors | null {
    const value = control.value

    if (!value) {
      return null
    }

    const hasUpperCase = /[A-Z]/.test(value)
    const hasLowerCase = /[a-z]/.test(value)
    const hasNumeric = /[0-9]/.test(value)

    const passwordValid = hasUpperCase && hasLowerCase && hasNumeric

    return !passwordValid ? { invalidPassword: true } : null
  }

  passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
    const password = control.get("password")
    const confirmPassword = control.get("confirmPassword")

    if (password && confirmPassword && password.value !== confirmPassword.value) {
      confirmPassword.setErrors({ passwordMismatch: true })
      return { passwordMismatch: true }
    }

    return null
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement

    if (input.files && input.files.length) {
      const file = input.files[0]
      const reader = new FileReader()

      reader.onload = () => {
        this.profileImage = reader.result
      }

      reader.readAsDataURL(file)
    }
  }

  onSubmit(): void {
    if (this.signUpForm.valid) {
      console.log("Form submitted:", this.signUpForm.value)
      // Implement sign-up logic
    } else {
      // Mark all fields as touched to trigger validation messages
      Object.keys(this.signUpForm.controls).forEach((key) => {
        const control = this.signUpForm.get(key)
        control?.markAsTouched()
      })
    }
  }
}
