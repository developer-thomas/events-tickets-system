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
import { StepOneComponent } from '../../pages/new-event/components/step-one/step-one.component';
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

  locationForm: FormGroup;
  categories: any[] = [];
  coverImage: File | null = null;
  logoImage: File | null = null;
  locationId: number | null = null;
  isLoading = false;

  representativeId: number | null = null;

  constructor() {
    this.locationForm = this.fb.group({
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
      locationLink: [""]
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
        // Se desejar mostrar preview das imagens:
        // this.coverImageUrl = loc.fileCoverUrl;
        // this.logoImageUrl = loc.fileLogoUrl;
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

  submit(): void {
    if (!this.locationId) return;
    if (this.locationForm.invalid) {
      this.locationForm.markAllAsTouched();
      return;
    }
    const formData = this.prepareLocationFormData();
    this.locationService.editLocation(this.locationId, formData).subscribe({
      next: (res: any) => {
        console.log('OI', res.result.representative.id)
        this.toastr.success('Local atualizado com sucesso');
        // mudar o step para o step 2 de representante
        // pegar a id do representante e armazenar no this.representativeId
        // Depois fazer a requisição para pegar os dados do representante pelo id
        // preencher os campos do form com os dados do representante
        // ao clicar em salvar fazer a requisição para atualizar o representante
        
      },
      error: (err) => {
        this.toastr.error('Erro ao atualizar local');
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
      formData.append('categoryIds', formValue.categoryIds);
    }
    if (this.coverImage) {
      formData.append('coverImage', this.coverImage, this.coverImage.name);
    }
    if (this.logoImage) {
      formData.append('logoImage', this.logoImage, this.logoImage.name);
    }
    return formData;
  }
}
