import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';

@Component({
  selector: 'app-step-one',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatInputModule, MatFormFieldModule, MatRadioModule, MatIconModule],
  templateUrl: './step-one.component.html',
  styleUrl: './step-one.component.scss'
})
export class StepOneComponent implements OnInit{
  @Input() formGroup!: FormGroup

  categories = [
    { id: 1, name: "Nome da categoria" },
    { id: 2, name: "Nome da categoria" },
    { id: 3, name: "Nome da categoria" },
    { id: 4, name: "Nome da categoria" },
    { id: 5, name: "Nome da categoria" },
    { id: 6, name: "Nome da categoria" },
    { id: 7, name: "Nome da categoria" },
    { id: 8, name: "Nome da categoria" },
  ]

  selectedCategories: number[] = []
  coverImageFile: File | null = null
  logoImageFile: File | null = null

  constructor() {}

  ngOnInit(): void {}

  // Helper method to get form control with proper typing
  getFormControl(name: string): FormControl {
    return this.formGroup.get(name) as FormControl
  }

  toggleCategory(categoryId: number): void {
    const index = this.selectedCategories.indexOf(categoryId)
    if (index === -1) {
      this.selectedCategories.push(categoryId)
    } else {
      this.selectedCategories.splice(index, 1)
    }
    this.getFormControl("categories").setValue([...this.selectedCategories])
  }

  isCategorySelected(categoryId: number): boolean {
    return this.selectedCategories.includes(categoryId)
  }

  onCoverImageSelected(event: Event): void {
    const input = event.target as HTMLInputElement
    if (input.files && input.files.length) {
      this.coverImageFile = input.files[0]
      this.getFormControl("coverImage").setValue(this.coverImageFile)
    }
  }

  onLogoImageSelected(event: Event): void {
    const input = event.target as HTMLInputElement
    if (input.files && input.files.length) {
      this.logoImageFile = input.files[0]
      this.getFormControl("logoImage").setValue(this.logoImageFile)
    }
  }
}
