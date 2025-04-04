import { CommonModule } from '@angular/common';
import { Component, EventEmitter, inject, Output } from '@angular/core';
import { FormGroup, FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';

export interface CategoryData {
  name: string
  image: File | null
}

@Component({
  selector: 'app-new-category',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatButtonModule, MatIconModule, MatInputModule, MatFormFieldModule],
  templateUrl: './new-category.component.html',
  styleUrl: './new-category.component.scss'
})
export class NewCategoryComponent {
  dialog = inject(MatDialogRef<NewCategoryComponent>)

  categoryForm!: FormGroup
  categoryImage: File | null = null
  

  @Output() save = new EventEmitter<CategoryData>()
  @Output() cancel = new EventEmitter<void>()

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.initForm()
  }

  initForm(): void {
    this.categoryForm = this.fb.group({
      name: ["", Validators.required],
      image: [null, Validators.required],
    })
  }

  onImageSelected(event: Event): void {
    const input = event.target as HTMLInputElement
    if (input.files && input.files.length) {
      this.categoryImage = input.files[0]
      this.categoryForm.patchValue({
        image: this.categoryImage,
      })
    }
  }

  onSubmit(): void {
    if (this.categoryForm.valid) {
      const categoryData: CategoryData = {
        name: this.categoryForm.value.name,
        image: this.categoryImage,
      }
      this.save.emit(categoryData)
    } else {
      // Mark all fields as touched to trigger validation messages
      this.markFormGroupTouched(this.categoryForm)
    }
  }

  onCancel(): void {
    this.dialog.close();
  }

  // Helper method to mark all controls as touched
  private markFormGroupTouched(formGroup: FormGroup): void {
    Object.values(formGroup.controls).forEach((control) => {
      control.markAsTouched()
    })
  }
}
