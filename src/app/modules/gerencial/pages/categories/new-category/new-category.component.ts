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
  public dialog = inject(MatDialogRef<NewCategoryComponent>)
  private fb = inject(FormBuilder)
  private toastr = inject(ToastrService);
  private categoryService = inject(CategoriesService)

  categoryForm!: FormGroup
  categoryImage: File | null = null
  categoryIconImage: File | null = null;


  @ViewChild("fileInput") fileInput!: ElementRef<HTMLInputElement>;
  @ViewChild("fileIconInput") fileIconInput!: ElementRef<HTMLInputElement>;

  @Output() save = new EventEmitter<CreateCategory>()
  @Output() cancel = new EventEmitter<void>()

  ngOnInit(): void {
    this.initForm()
  }

  initForm(): void {
    this.categoryForm = this.fb.group({
      name: ["", Validators.required],
      image: [null, Validators.required],
      icon: [null, Validators.required]
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

  onImageIconSelected(event: Event): void {
    const input = event.target as HTMLInputElement
    if (input.files && input.files.length) {
      this.categoryIconImage = input.files[0]
      this.categoryForm.patchValue({
        icon: this.categoryIconImage,
      })
    }
  }

  async onSubmit(): Promise<void> {
    if (this.categoryForm.valid && this.categoryImage && this.categoryIconImage) {
      try {        
        const categoryData = new FormData();
        categoryData.append('name', this.categoryForm.value.name);
        categoryData.append('imageCover', this.categoryImage);
        categoryData.append('imageIcon', this.categoryIconImage); 

        this.categoryService.create(categoryData).subscribe({
          next: (_) => {
            this.toastr.success("Categoria criada com sucesso:")
            this.dialog.close();
          }, error: (error) => {
            this.toastr.error('Erro ao criar categoria:', error.error.message);
            console.error('Erro ao criar categoria:', error);
          }
        })
      } catch (error) {
        this.toastr.error('Erro ao converter imagem para base64');
        console.error('Erro ao converter imagem:', error);
      }
    } else {
      this.markFormGroupTouched(this.categoryForm)
      this.toastr.warning('Preencha todos os campos e selecione as duas imagens.');
    }
  }

  onCancel(): void {
    this.dialog.close()
  }

  private markFormGroupTouched(formGroup: FormGroup): void {
    Object.values(formGroup.controls).forEach((control) => {
      control.markAsTouched()
    })
  }
}
