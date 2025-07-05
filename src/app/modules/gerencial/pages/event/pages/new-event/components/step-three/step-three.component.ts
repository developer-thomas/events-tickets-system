import { CommonModule } from '@angular/common';
import { Component, ElementRef, inject, Input, OnInit, ViewChild } from '@angular/core';
import { ReactiveFormsModule, FormGroup, FormBuilder, FormArray, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { EventService } from '../../../../event.service';
import { GetCategoriesNames } from '../../../../models/CreateEvent.interface';

@Component({
  selector: 'app-step-three',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatInputModule,
    MatFormFieldModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule
  ],
  templateUrl: './step-three.component.html',
  styleUrl: './step-three.component.scss'
})
export class StepThreeComponent implements OnInit {
  @Input() formGroup!: FormGroup
  sponsorsForm!: FormGroup

  sponsorCategories: GetCategoriesNames[] = []
  loading = false

  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>

  private fb = inject(FormBuilder)
  private eventService = inject(EventService)

  ngOnInit(): void {
    this.initializeForm();
    this.loadCategories();
  }

  private loadCategories(): void {
    this.loading = true;
    this.disableAllCategoryControls();
    
    this.eventService.getCategoriesNames().subscribe({
      next: (categories) => {
        this.sponsorCategories = categories;
        this.loading = false;
        this.enableAllCategoryControls();
      },
      error: (error) => {
        console.error('Erro ao carregar categorias:', error);
        this.loading = false;
        this.enableAllCategoryControls();
      }
    });
  }

  private disableAllCategoryControls(): void {
    if (!this.sponsorsForm) return;
    
    const items = this.sponsorItems;
    for (let i = 0; i < items.length; i++) {
      const categoryControl = items.at(i).get('categoryId');
      if (categoryControl) {
        categoryControl.disable();
      }
    }
  }

  private enableAllCategoryControls(): void {
    if (!this.sponsorsForm) return;
    
    const items = this.sponsorItems;
    for (let i = 0; i < items.length; i++) {
      const categoryControl = items.at(i).get('categoryId');
      if (categoryControl) {
        categoryControl.enable();
      }
    }
  }

  private initializeForm(): void {
    // Ensure the sponsors form group exists
    if (!this.formGroup.get("sponsors")) {
      this.formGroup.addControl(
        "sponsors",
        this.fb.group({
          items: this.fb.array([this.createSponsorItem()]),
        }),
      )
    }

    // Set the local sponsorsForm reference
    this.sponsorsForm = this.formGroup.get("sponsors") as FormGroup

    // Ensure there's at least one sponsor item (only for new events)
    const items = this.sponsorsForm.get("items") as FormArray;
    
    // Only add default item if this is a new event (no existing data)
    const hasExistingData = items.length > 0 && items.at(0).get('name')?.value;
    
    if (items.length === 0 && !hasExistingData) {
      items.push(this.createSponsorItem());
    }

    console.log('StepThree: Form initialized', {
      sponsorsForm: !!this.sponsorsForm,
      itemsLength: items.length,
      formGroupKeys: Object.keys(this.formGroup.controls)
    });
  }

  // Helper method to get sponsors items form array
  get sponsorItems(): FormArray {
    if (!this.sponsorsForm) {
      return this.fb.array([]) as FormArray;
    }
    return this.sponsorsForm.get("items") as FormArray
  }

  // Create a new sponsor item form group
  createSponsorItem(): FormGroup {
    return this.fb.group({
      name: ["", Validators.required],
      categoryId: ["", Validators.required],
      description: ["", Validators.required],
      logoImage: [null],
    })
  }

  // Add a new sponsor item
  addSponsorItem(): void {
    if (!this.sponsorsForm) return;
    
    const newItem = this.createSponsorItem();
    this.sponsorItems.push(newItem);
    
    // Enable the new item's category control if categories are loaded
    if (!this.loading) {
      const categoryControl = newItem.get('categoryId');
      if (categoryControl) {
        categoryControl.enable();
      }
    }
  }

  // Remove a sponsor item
  removeSponsorItem(index: number): void {
    if (!this.sponsorsForm) return;
    
    if (this.sponsorItems.length > 1) {
      this.sponsorItems.removeAt(index)
    } else {
      // If it's the last item, just reset it instead of removing
      this.sponsorItems.at(0).reset()
    }
    // Reset file input
    if (this.fileInput) {
      this.fileInput.nativeElement.value = ''
    }
  }

  // Upload sponsor logo
  uploadSponsorLogo(event: Event, index: number): void {
    if (!this.sponsorsForm) return;
    
    const input = event.target as HTMLInputElement
    if (input.files && input.files.length) {
      const file = input.files[0]
      
      // Converter o arquivo para base64
      const reader = new FileReader()
      reader.readAsDataURL(file)
      reader.onload = () => {
        const base64 = reader.result as string
        
        // Verificar se o base64 é válido
        if (base64 && base64.length > 0) {
          // Armazenar o base64 completo no formulário (incluindo o prefixo)
          this.sponsorItems.at(index).get("logoImage")?.setValue(base64)
        } else {
          console.error('Invalid base64 data generated')
        }
      }
      reader.onerror = (error) => {
        console.error('Error converting image to base64:', error)
      }
    }
  }

  // Remove sponsor logo
  removeSponsorLogo(index: number): void {
    if (!this.sponsorsForm) return;
    
    this.sponsorItems.at(index).get("logoImage")?.setValue(null)
    // Reset file input
    if (this.fileInput) {
      this.fileInput.nativeElement.value = ''
    }
  }

  // Helper to get file name for display
  getFileName(file: File | string): string {
    if (typeof file === 'string') {
      return 'Imagem em base64'
    }
    return file ? file.name : ""
  }
}
