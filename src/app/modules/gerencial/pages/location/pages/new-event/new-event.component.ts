import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
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
import { LocationService } from '../../location.service';
import { of, forkJoin, switchMap, Observable } from 'rxjs';
import { CreateRepresentante } from '../../models/CreateRepresentante.interface';
import { ToastrService } from 'ngx-toastr';

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
  private fb = inject(FormBuilder)
  private router = inject(Router)
  private locationService = inject(LocationService)
  private toastr = inject(ToastrService);

  currentStep = 1
  totalSteps = 2
  locationForm: FormGroup
  categories: any[] = []
  createdLocationId: number | null = null
  coverImage: File | null = null
  logoImage: File | null = null

  constructor() {
    this.locationForm = this.fb.group({
      // Dados do Local
      name: ["", Validators.required],
      description: ["", Validators.required],
      categoryIds: [[]],
      street: ["", Validators.required],
      number: ["", Validators.required],
      neighborhood: ["", Validators.required],
      cep: ["", Validators.required],
      city: ["", Validators.required],
      uf: ["", Validators.required],
      active: [true],
      coverImage: [null],
      logoImage: [null],
      locationLink: [""],

      // Representante será adicionado dinamicamente no StepTwoComponent
    })
  }

  ngOnInit(): void {
    this.loadCategories()
  }

  loadCategories(): void {
    this.locationService.getCategoriesNames().subscribe({
      next: (data) => {
        this.categories = data
      },
      error: (error) => {
        console.error("Erro ao carregar categorias:", error)
      },
    })
  }

  onCoverImageSelected(file: File): void {
    this.coverImage = file
  }

  onLogoImageSelected(file: File): void {
    this.logoImage = file
  }

  nextStep(): void {
    if (this.currentStep < this.totalSteps) {
      if (this.validateCurrentStep()) {
        if (this.currentStep === 1) {
          this.submitLocationData()
        } else {
          this.currentStep++
        }
      }
    } else {
      this.submitRepresentativeData()
    }
  }

  previousStep(): void {
    if (this.currentStep > 1) {
      this.currentStep--
    }
  }

  validateCurrentStep(): boolean {
    if (this.currentStep === 1) {
      const step1Controls = ["name", "description"]
      return this.validateControls(step1Controls)
    } else if (this.currentStep === 2) {
      const representativeGroup = this.locationForm.get("representative") as FormGroup
      return representativeGroup.valid
    }
    return true
  }

  validateControls(controlNames: string[]): boolean {
    let valid = true
    for (const name of controlNames) {
      const control = this.locationForm.get(name)
      if (control && control.invalid) {
        control.markAsTouched()
        valid = false
      }
    }
    return valid
  }

  submitLocationData(): void {
    if (this.validateCurrentStep()) {
      this.prepareLocationData().subscribe({
        next: (formData) => {
          this.locationService.createLocation(formData).subscribe({
            next: (response) => {
              this.createdLocationId = response.result.id
              this.currentStep++
              this.toastr.success("Local criado com sucesso")
            },
            error: (error) => {
              console.error("Erro ao criar local:", error)
          this.toastr.error("Erro ao criar local:", error.error.message)

            },
          })
        },
        error: (error) => {
          console.error("Erro ao preparar dados do local:", error)
        },
      })
    } else {
      this.markFormGroupTouched(this.locationForm)
    }
  }

  prepareLocationData() {
    const formValue = this.locationForm.value

    // Observables para converter imagens para base64
    const coverImageObs = this.coverImage ? this.convertFileToBase64(this.coverImage) : of(undefined)

    const logoImageObs = this.logoImage ? this.convertFileToBase64(this.logoImage) : of(undefined)

    // Combinar os observables e retornar os dados formatados
    return forkJoin({
      coverImage: coverImageObs,
      logoImage: logoImageObs,
    }).pipe(
      switchMap(({ coverImage, logoImage }) => {
        const locationData = {
          name: formValue.name,
          description: formValue.description,
          categoryIds: formValue.categoryIds,
          street: formValue.street,
          number: formValue.number,
          neighborhood: formValue.neighborhood,
          cep: formValue.cep,
          city: formValue.city,
          uf: formValue.uf,
          active: formValue.active,
          coverImage: coverImage ? coverImage.split(",")[1] : undefined, // Remover o prefixo "data:image/jpeg;base64,"
          logoImage: logoImage ? logoImage.split(",")[1] : undefined, // Remover o prefixo "data:image/jpeg;base64,"
        }
        return of(locationData)
      }),
    )
  }

  submitRepresentativeData(): void {
    if (this.locationForm.valid && this.createdLocationId) {
      const representativeValues = this.locationForm.get("representative")?.value

      const representativeData: CreateRepresentante = {
        name: representativeValues.name,
        email: representativeValues.email,
        password: representativeValues.password,
        cpf_cnpj: representativeValues.taxId,
        placeId: this.createdLocationId,
        phone: representativeValues.phone,
      }

      this.locationService.createRepresentante(representativeData).subscribe({
        next: (_) => {
          this.toastr.success("Representante criado com sucesso")
          this.router.navigate(["/gerencial/local"])
        },
        error: (error) => {
          this.toastr.error("Erro ao criar representante:", error.error.message)
          console.error("Erro ao criar representante", error)
        },
      })
    } else {
      this.markFormGroupTouched(this.locationForm)
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

  // Helper method to convert File to base64 usando Observable
  private convertFileToBase64(file: File) {
    return new Observable<string>((observer) => {
      const reader = new FileReader()
      reader.readAsDataURL(file)
      reader.onload = () => {
        observer.next(reader.result as string)
        observer.complete()
      }
      reader.onerror = (error) => {
        observer.error(error)
      }
    })
  }

  cancel(): void {
    this.router.navigate(["/gerencial/location"])
  }
}
