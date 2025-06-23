import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';
import { LocationService } from '../../location.service';
import { ToastrService } from 'ngx-toastr';
import { StepOneComponent } from '../new-event/components/step-one/step-one.component';
import { StepTwoComponent } from '../new-event/components/step-two/step-two.component';
import { PageHeaderComponent } from '../../../../../shared/components/page-header/page-header.component';

@Component({
  selector: 'app-location-edit',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatInputModule,
    MatFormFieldModule,
    MatButtonModule,
    MatIconModule,
    MatRadioModule,
    StepOneComponent,
    StepTwoComponent,
    PageHeaderComponent,
  ],
  templateUrl: './location-edit.component.html',
  styleUrl: './location-edit.component.scss',
})
export class LocationEditComponent implements OnInit {
  private fb = inject(FormBuilder);
  private route = inject(ActivatedRoute);
  public router = inject(Router);
  private locationService = inject(LocationService);
  private toastr = inject(ToastrService);

  currentStep = 1;
  totalSteps = 2;
  locationForm: FormGroup;
  categories: any[] = [];
  coverImage: File | null = null;
  logoImage: File | null = null;
  locationId: number | null = null;
  representativeId: number | null = null;
  isLoading = false;

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
    });
  }

  ngOnInit(): void {
    this.loadCategories();
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.locationId = +id;
        this.fetchLocationData(this.locationId);
      }
    });
  }

  loadCategories(): void {
    this.locationService.getCategoriesNames().subscribe({
      next: (data) => {
        this.categories = data;
      },
      error: () => {
        this.toastr.error('Erro ao carregar categorias');
      }
    });
  }

  fetchLocationData(id: number): void {
    this.isLoading = true;
    this.locationService.getLocationById(id).subscribe({
      next: (res) => {
        const loc = res.result;
        this.locationForm.patchValue({
          name: loc.name,
          description: loc.description,
          categoryIds: loc.categories.map(c => c.id),
          street: loc.addressLocation?.street || '',
          number: loc.addressLocation?.number || '',
          neighborhood: loc.addressLocation?.neighborhood || '',
          cep: loc.addressLocation?.cep || '',
          city: loc.addressLocation?.city || '',
          uf: loc.addressLocation?.uf || '',
          active: true, // ou loc.active se existir
          locationLink: '' // ajuste se existir no backend
        });
        this.isLoading = false;
      },
      error: () => {
        this.toastr.error('Erro ao carregar dados do local');
        this.isLoading = false;
      }
    });
  }

  onCoverImageSelected(file: File): void {
    this.coverImage = file;
    this.locationForm.patchValue({ coverImage: file });
  }

  onLogoImageSelected(file: File): void {
    this.logoImage = file;
    this.locationForm.patchValue({ logoImage: file });
  }

  nextStep(): void {
    if (this.currentStep < this.totalSteps) {
      if (this.validateCurrentStep()) {
        if (this.currentStep === 1) {
          this.submitLocationData();
        } else {
          this.currentStep++;
        }
      }
    } else {
      this.submitRepresentativeData();
    }
  }

  previousStep(): void {
    if (this.currentStep > 1) {
      this.currentStep--;
    }
  }

  validateCurrentStep(): boolean {
    if (this.currentStep === 1) {
      const step1Controls = ["name", "description", "street", "number", "neighborhood", "cep", "city", "uf"];
      return this.validateControls(step1Controls);
    } else if (this.currentStep === 2) {
      const representativeGroup = this.locationForm.get("representative") as FormGroup;
      return representativeGroup ? representativeGroup.valid : false;
    }
    return true;
  }

  validateControls(controlNames: string[]): boolean {
    let valid = true;
    for (const name of controlNames) {
      const control = this.locationForm.get(name);
      if (control && control.invalid) {
        control.markAsTouched();
        valid = false;
      }
    }
    return valid;
  }

  submitLocationData(): void {
    if (!this.locationId) return;
    
    const formData = this.prepareLocationFormData();
    this.locationService.editLocation(this.locationId, formData).subscribe({
      next: (res: any) => {
        console.log('Location updated, representative ID:', res.result.representative.id);
        this.representativeId = res.result.representative.id;
        this.toastr.success('Local atualizado com sucesso');
        
        // Mudar para o step 2 e carregar dados do representante
        this.currentStep = 2;
        this.loadRepresentativeData();
      },
      error: (err) => {
        this.toastr.error('Erro ao atualizar local');
        console.error(err);
      }
    });
  }

  loadRepresentativeData(): void {
    if (!this.representativeId) return;
    
    this.locationService.getRepresentativeById(this.representativeId).subscribe({
      next: (res) => {
        const representative = res.result;
        
        // Inicializar o grupo representative se não existir
        if (!this.locationForm.get("representative")) {
          const representativeGroup = this.fb.group({
            name: ["", Validators.required],
            taxId: ["", Validators.required],
            email: ["", [Validators.required, Validators.email]],
            password: ["", [Validators.required, Validators.minLength(6)]],
            phone: ["", Validators.required],
          });
          this.locationForm.setControl("representative", representativeGroup);
        }
        
        // Preencher os dados do representante
        this.locationForm.patchValue({
          representative: {
            name: representative.name,
            taxId: representative.cpf_cnpj,
            email: representative.email,
            password: '', // Não preencher senha por segurança
            phone: '', // Campo será preenchido pelo usuário
          }
        });
      },
      error: () => {
        this.toastr.error('Erro ao carregar dados do representante');
      }
    });
  }

  submitRepresentativeData(): void {
    if (!this.representativeId || !this.locationId) return;
    
    const representativeData = this.locationForm.get("representative")?.value;
    if (!representativeData) return;
    
    const payload = {
      id: this.representativeId,
      name: representativeData.name,
      email: representativeData.email,
      password: representativeData.password,
      cpf_cnpj: representativeData.taxId,
      placeId: this.locationId,
      phone: representativeData.phone,
    };
    
    this.locationService.updateRepresentante(payload).subscribe({
      next: () => {
        this.toastr.success('Representante atualizado com sucesso');
        this.router.navigate(['/gerencial/local']);
      },
      error: (err) => {
        this.toastr.error('Erro ao atualizar representante');
        console.error(err);
      }
    });
  }

  prepareLocationFormData(): FormData {
    const formValue = this.locationForm.value;
    const formData = new FormData();
    
    formData.append('name', formValue.name || '');
    formData.append('description', formValue.description || '');
    formData.append('street', formValue.street || '');
    formData.append('number', formValue.number || '');
    formData.append('neighborhood', formValue.neighborhood || '');
    formData.append('cep', formValue.cep || '');
    formData.append('city', formValue.city || '');
    formData.append('uf', formValue.uf || '');
    formData.append('active', formValue.active ? 'true' : 'false');
    
    if (formValue.locationLink) {
      formData.append('locationLink', formValue.locationLink);
    }
    
    if (formValue.categoryIds && formValue.categoryIds.length > 0) {
      formValue.categoryIds.forEach((categoryId: any) => {
        formData.append('categoryIds', categoryId);
      });
    }
    
    if (this.coverImage) {
      formData.append('coverImage', this.coverImage, this.coverImage.name);
    }
    
    if (this.logoImage) {
      formData.append('logoImage', this.logoImage, this.logoImage.name);
    }
    
    return formData;
  }

  cancel(): void {
    this.router.navigate(['/gerencial/local']);
  }
}
