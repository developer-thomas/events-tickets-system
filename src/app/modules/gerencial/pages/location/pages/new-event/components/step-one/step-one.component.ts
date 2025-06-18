import { CommonModule } from '@angular/common';
import { Component, EventEmitter, inject, Input, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';
import { NgxMaskDirective } from 'ngx-mask';
import { AddressService } from '../../../../../../../../core/services/address.service';
import { ToastrService } from 'ngx-toastr';
import { debounceTime, distinctUntilChanged, filter, switchMap, catchError, of } from 'rxjs';

@Component({
  selector: 'app-step-one',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatInputModule, MatFormFieldModule, MatRadioModule, MatIconModule, NgxMaskDirective],
  templateUrl: './step-one.component.html',
  styleUrl: './step-one.component.scss'
})
export class StepOneComponent implements OnInit {
  private addressService = inject(AddressService);
  private toastr = inject(ToastrService);

  @Input() formGroup!: FormGroup
  @Input() categories: any[] = []

  @Output() coverImageSelected = new EventEmitter<File>()
  @Output() logoImageSelected = new EventEmitter<File>()

  selectedCategories: number[] = []
  coverImageFile: File | null = null
  logoImageFile: File | null = null

  states = [
    { value: "AC", label: "Acre" },
    { value: "AL", label: "Alagoas" },
    { value: "AP", label: "Amapá" },
    { value: "AM", label: "Amazonas" },
    { value: "BA", label: "Bahia" },
    { value: "CE", label: "Ceará" },
    { value: "DF", label: "Distrito Federal" },
    { value: "ES", label: "Espírito Santo" },
    { value: "GO", label: "Goiás" },
    { value: "MA", label: "Maranhão" },
    { value: "MT", label: "Mato Grosso" },
    { value: "MS", label: "Mato Grosso do Sul" },
    { value: "MG", label: "Minas Gerais" },
    { value: "PA", label: "Pará" },
    { value: "PB", label: "Paraíba" },
    { value: "PR", label: "Paraná" },
    { value: "PE", label: "Pernambuco" },
    { value: "PI", label: "Piauí" },
    { value: "RJ", label: "Rio de Janeiro" },
    { value: "RN", label: "Rio Grande do Norte" },
    { value: "RS", label: "Rio Grande do Sul" },
    { value: "RO", label: "Rondônia" },
    { value: "RR", label: "Roraima" },
    { value: "SC", label: "Santa Catarina" },
    { value: "SP", label: "São Paulo" },
    { value: "SE", label: "Sergipe" },
    { value: "TO", label: "Tocantins" },
  ]

  ngOnInit(): void {
    const categoryId = this.getFormControl("categoryIds").value
    if (categoryId && Array.isArray(categoryId) && categoryId.length > 0) {
      this.selectedCategories = categoryId
    }

    if (!this.getFormControl("uf").value) {
      this.getFormControl("uf").setValue("SP")
    }

    // Escuta mudanças no CEP e busca endereço
  this.getFormControl('cep').valueChanges
  .pipe(
    debounceTime(300),
    distinctUntilChanged(),
    filter(value => value && value.length === 9),
    switchMap((cep) => this.addressService.getAddress(cep)),
    catchError((error) => {
      console.error('Erro ao buscar CEP:', error);
      return of(null); // Evita quebrar o fluxo
    })
  )
  .subscribe((data) => {
    if (data) {
      this.getFormControl('street').setValue(data.street || '');
      this.getFormControl('neighborhood').setValue(data.neighborhood || '');
      this.getFormControl('city').setValue(data.city || '');
      this.getFormControl('uf').setValue(data.state || '');
    }
  });
  }

  // Helper method to get form control with proper typing
  getFormControl(name: string): FormControl {
    return this.formGroup.get(name) as FormControl
  }

  toggleCategory(categoryId: number): void {
    if (this.selectedCategories[0] === categoryId) {
      // Desmarca se já estiver selecionado (comportamento opcional)
      this.selectedCategories = []
      this.getFormControl("categoryIds").setValue([])
    } else {
      this.selectedCategories = [categoryId]
      this.getFormControl("categoryIds").setValue([categoryId]);
    }
  }

  isCategorySelected(categoryId: number): boolean {
    return this.selectedCategories.includes(categoryId)
  }

  onCoverImageSelected(event: Event): void {
    const input = event.target as HTMLInputElement
    if (input.files && input.files.length) {
      this.coverImageFile = input.files[0]
      this.getFormControl("coverImage").setValue(this.coverImageFile)
      this.coverImageSelected.emit(this.coverImageFile)
    }
  }

  onLogoImageSelected(event: Event): void {
    const input = event.target as HTMLInputElement
    if (input.files && input.files.length) {
      this.logoImageFile = input.files[0]
      this.getFormControl("logoImage").setValue(this.logoImageFile)
      this.logoImageSelected.emit(this.logoImageFile)
    }
  }

  // Método para validar arquivos de imagem
  validateImageFile(file: File): boolean {
    const allowedTypes = ["image/jpeg", "image/png", "image/jpg"]
    const maxSize = 5 * 1024 * 1024 // 5MB

    if (!allowedTypes.includes(file.type)) {
      console.error("Tipo de arquivo não permitido. Use JPEG ou PNG.")
      return false
    }

    if (file.size > maxSize) {
      console.error("Arquivo muito grande. Máximo 5MB.")
      return false
    }

    return true
  }

  // Método para preview da imagem (opcional)
  getImagePreview(file: File): string {
    return URL.createObjectURL(file)
  }

  fetchAddressByCEP(cep: string): void {
    cep = cep?.replace(/\D/g, '');

    if (!cep || cep.length !== 8) return;
  
    this.addressService.getAddress(cep).subscribe({
      next: (data) => {
        this.getFormControl('street').setValue(data.street || '');
        this.getFormControl('neighborhood').setValue(data.neighborhood || '');
        this.getFormControl('city').setValue(data.city || '');
        this.getFormControl('uf').setValue(data.state || '');
      },
      error: (err) => {
        this.toastr.error("Erro ao buscar endereço")
        console.error('Erro ao buscar endereço:', err);
      }
    });
  }
}
