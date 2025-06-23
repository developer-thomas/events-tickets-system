import { CommonModule } from '@angular/common';
import { Component, ElementRef, inject, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { CategoriesService } from '../categories.service';
import { GetOneCategory } from '../models/GetOneCategory.interface';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-edit-category',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatButtonModule, MatIconModule, MatInputModule, MatFormFieldModule],
  templateUrl: './edit-category.component.html',
  styleUrl: './edit-category.component.scss'
})
export class EditCategoryComponent implements OnInit {
  public dialog = inject(MatDialogRef<EditCategoryComponent>);
  private fb = inject(FormBuilder);
  private categoryService = inject(CategoriesService);
  private toastr = inject(ToastrService);
  private data = inject(MAT_DIALOG_DATA);

  categoryForm!: FormGroup;
  categoryImage: File | null = null;
  categoryIconImage: File | null = null;
  categoryId: number | null = null;
  isLoading = false;

  @ViewChild("fileInput") fileInput!: ElementRef<HTMLInputElement>;
  @ViewChild("fileIconInput") fileIconInput!: ElementRef<HTMLInputElement>;

  ngOnInit(): void {
    this.initForm();
    this.categoryId = this.data.categoryId;
    if (this.categoryId) {
      this.fetchCategoryData(this.categoryId);
    }
  }

  initForm(): void {
    this.categoryForm = this.fb.group({
      name: ["", Validators.required],
      image: [null, Validators.required],
      icon: [null, Validators.required]
    });
  }

  fetchCategoryData(id: number): void {
    this.isLoading = true;
    this.categoryService.getOneCategory(id).subscribe({
      next: (category) => {
        this.categoryForm.patchValue({
          name: category.name
        });
        // As imagens serão mostradas como preview, mas não são obrigatórias para edição
        this.categoryForm.get('image')?.setValidators([]);
        this.categoryForm.get('icon')?.setValidators([]);
        this.categoryForm.updateValueAndValidity();
        this.isLoading = false;
      },
      error: () => {
        this.toastr.error('Erro ao carregar dados da categoria');
        this.isLoading = false;
      }
    });
  }

  onImageSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length) {
      this.categoryImage = input.files[0];
      this.categoryForm.patchValue({
        image: this.categoryImage,
      });
    }
  }

  onImageIconSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length) {
      this.categoryIconImage = input.files[0];
      this.categoryForm.patchValue({
        icon: this.categoryIconImage,
      });
    }
  }

  async onSubmit(): Promise<void> {
    if (!this.categoryId) return;
    
    if (this.categoryForm.valid) {
      try {
        const categoryData = new FormData();
        categoryData.append('name', this.categoryForm.value.name);
        
        // Adicionar imagens apenas se foram selecionadas
        if (this.categoryImage) {
          categoryData.append('imageCover', this.categoryImage);
        }
        if (this.categoryIconImage) {
          categoryData.append('imageIcon', this.categoryIconImage);
        }

        this.categoryService.updateCategory(this.categoryId, categoryData).subscribe({
          next: (_) => {
            this.toastr.success("Categoria atualizada com sucesso");
            this.dialog.close();
          },
          error: (error) => {
            this.toastr.error('Erro ao atualizar categoria:', error.error.message);
            console.error('Erro ao atualizar categoria:', error);
          }
        });
      } catch (error) {
        this.toastr.error('Erro ao processar dados da categoria');
        console.error('Erro ao processar dados:', error);
      }
    } else {
      this.markFormGroupTouched(this.categoryForm);
      this.toastr.warning('Preencha todos os campos obrigatórios.');
    }
  }

  onCancel(): void {
    this.dialog.close();
  }

  private markFormGroupTouched(formGroup: FormGroup): void {
    Object.values(formGroup.controls).forEach((control) => {
      control.markAsTouched();
    });
  }
}
