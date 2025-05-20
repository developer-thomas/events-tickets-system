import { CommonModule } from '@angular/common';
import { Component, ElementRef, EventEmitter, inject, OnInit, Output, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { CategoriesService } from '../categories.service';
import { CreateCategory } from '../models/CreateCategory.interface';
import { ConvertbasefileService } from '../../../../shared/services/convert-base64/convertbasefile.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-new-category',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatButtonModule, MatIconModule, MatInputModule, MatFormFieldModule],
  templateUrl: './new-category.component.html',
  styleUrl: './new-category.component.scss'
})
export class NewCategoryComponent implements OnInit {
  dialog = inject(MatDialogRef<NewCategoryComponent>)
  private fb = inject(FormBuilder)
  private categoryService = inject(CategoriesService)
  private convertBaseFile = inject(ConvertbasefileService);
  private toastr = inject(ToastrService);

  categoryForm!: FormGroup
  categoryImage: File | null = null

  @ViewChild("fileInput") fileInput!: ElementRef<HTMLInputElement>
  
  @Output() save = new EventEmitter<CreateCategory>()
  @Output() cancel = new EventEmitter<void>()

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
    if (this.categoryForm.valid && this.categoryImage) {
      this.convertBaseFile.convertFileToBase64(this.categoryImage).then((base64) => {
        const categoryData: CreateCategory = {
          name: this.categoryForm.value.name,
          file: base64.split(",")[1], // Remover o prefixo "data:image/jpeg;base64,"
        }

        this.categoryService.create(categoryData).subscribe({
          next: (_) => {
            this.toastr.success("Categoria criada com sucesso:")
            this.dialog.close()
          },
          error: (error) => {
            this.toastr.error("Erro ao criar categoria:", error.error.message)
            console.error("Erro ao criar categoria:", error)
          },
        })
      })
    } else {
      // Mark all fields as touched to trigger validation messages
      this.markFormGroupTouched(this.categoryForm)
    }
  }

  onCancel(): void {
    this.dialog.close()
  }

  // Helper method to mark all controls as touched
  private markFormGroupTouched(formGroup: FormGroup): void {
    Object.values(formGroup.controls).forEach((control) => {
      control.markAsTouched()
    })
  }
}
