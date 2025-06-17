import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { ReactiveFormsModule, FormGroup, FormBuilder, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { Router, RouterModule } from '@angular/router';
import { NgxMaskDirective } from 'ngx-mask';
import { ClientFooterComponent } from '../../../shared/components/client-footer/client-footer.component';
import { ClientHeaderComponent } from '../../../shared/components/client-header/client-header.component';
import { AuthService } from '../../../../core/auth/auth.service';

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
export class SignUpComponent implements OnInit{
  private fb = inject(FormBuilder)
  private router = inject(Router)
  private authService = inject(AuthService)

  signUpForm!: FormGroup
  profileImage: string | ArrayBuffer | null = null
  profileImageFile: File | null = null
  loading = false

  genderOptions = [
    { value: "masculino", label: "Masculino" },
    { value: "feminino", label: "Feminino" },
    { value: "outro", label: "Outro" },
    { value: "prefiro_nao_informar", label: "Prefiro não informar" },
  ]

  ngOnInit(): void {
    this.signUpForm = this.fb.group(
      {
        fullName: ["", [Validators.required]],
        email: ["", [Validators.required, Validators.email]],
        birthDate: ["", [Validators.required]],
        phone: ["", [Validators.required]],
        cpf: ["", [Validators.required]],
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
      this.profileImageFile = file

      const reader = new FileReader()
      reader.onload = () => {
        this.profileImage = reader.result
      }
      reader.readAsDataURL(file)
    }
  }

  private formatDateToISO(dateString: string): string {
    try {
      if (!dateString || typeof dateString !== "string") {
        console.error("Invalid date string:", dateString)
        return new Date().toISOString()
      }

      if (dateString.length === 8 && !dateString.includes("/")) {
        const day = dateString.substring(0, 2)
        const month = dateString.substring(2, 4)
        const year = "20" + dateString.substring(4, 6) 

        const formattedDate = `${year}-${month}-${day}T00:00:00.000Z`


        const date = new Date(formattedDate)
        if (isNaN(date.getTime())) {
          console.error("Invalid date after formatting:", formattedDate)
          return new Date().toISOString()
        }

        return formattedDate
      }

      else if (dateString.includes("/")) {
        const parts = dateString.split("/")
        if (parts.length !== 3) {
          console.error("Invalid date format:", dateString)
          return new Date().toISOString()
        }

        const day = parts[0].padStart(2, "0")
        const month = parts[1].padStart(2, "0")
        const year = parts[2].length === 2 ? "20" + parts[2] : parts[2]

        const formattedDate = `${year}-${month}-${day}T00:00:00.000Z`
        const date = new Date(formattedDate)

        if (isNaN(date.getTime())) {
          console.error("Invalid date after formatting:", formattedDate)
          return new Date().toISOString()
        }

        return formattedDate
      } else {
        console.error("Unrecognized date format:", dateString)
        return new Date().toISOString()
      }
    } catch (error) {
      console.error("Error formatting date:", error, "for date string:", dateString)
      return new Date().toISOString()
    }
  }

  private formatCPF(cpf: string): string {
    return cpf.replace(/\D/g, "")
  }

  private formatPhone(phone: string): string {
    return phone.replace(/\D/g, "")
  }

  async onSubmit(): Promise<void> {
    if (this.signUpForm.valid) {
      this.loading = true

      try {
        const formValue = this.signUpForm.value
        const formData = new FormData()

        formData.append("name", formValue.fullName)
        formData.append("email", formValue.email)
        formData.append("password", formValue.password)
        formData.append("cpf", this.formatCPF(formValue.cpf))
        formData.append("phone", this.formatPhone(formValue.phone))
        formData.append("dateOfBirth", this.formatDateToISO(formValue.birthDate))

        if (this.profileImageFile) {
          formData.append("imageFile", this.profileImageFile, this.profileImageFile.name)
        }

        formData.forEach((value, key) => {
          if (key === "imageFile") {
            console.log(`${key}: [File] ${(value as File).name}`)
          } else {
            console.log(`${key}: ${value}`)
          }
        })

        this.authService.register(formData).subscribe({
          next: (response) => {
            console.log("Registration successful:", response)
            this.loading = false
            this.router.navigate(["/login"], {
              queryParams: { message: "Conta criada com sucesso! Faça login para continuar." },
            })
          },
          error: (error) => {
            console.error("Registration error:", error)
            this.loading = false
          },
        })
      } catch (error) {
        console.error("Error processing registration:", error)
        this.loading = false
      }
    } else {
      Object.keys(this.signUpForm.controls).forEach((key) => {
        const control = this.signUpForm.get(key)
        control?.markAsTouched()
      })
    }
  }
}
