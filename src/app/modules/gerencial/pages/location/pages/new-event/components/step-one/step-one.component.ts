import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';
import { NgxMaskDirective } from 'ngx-mask';

@Component({
  selector: 'app-step-one',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatInputModule, MatFormFieldModule, MatRadioModule, MatIconModule, NgxMaskDirective],
  templateUrl: './step-one.component.html',
  styleUrl: './step-one.component.scss'
})
export class StepOneComponent implements OnInit{
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
    // Verificar se já existe uma categoria selecionada
    const categoryId = this.getFormControl("categoryIds").value
    if (categoryId && Array.isArray(categoryId) && categoryId.length > 0) {
      this.selectedCategories = categoryId
    }

    // Definir SP como estado padrão se não estiver definido
    if (!this.getFormControl("uf").value) {
      this.getFormControl("uf").setValue("SP")
    }
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
      this.getFormControl("categoryIds").setValue([categoryId]) // API espera um array
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
}
