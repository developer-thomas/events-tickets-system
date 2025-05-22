import { CommonModule } from '@angular/common';
import { Component, ElementRef, inject, Input, OnInit, ViewChild } from '@angular/core';
import { ReactiveFormsModule, FormGroup, FormBuilder, FormArray, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { EventService } from '../../../../event.service';
import { ImagePreviewPipe } from '../../../../../../../shared/pipes/image-preview.pipe';
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
    MatIconModule,
    ImagePreviewPipe
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
    this.loadCategories();
    this.initializeForm();
  }

  private loadCategories(): void {
    this.loading = true;
    this.eventService.getCategoriesNames().subscribe({
      next: (categories) => {
        this.sponsorCategories = categories;
        this.loading = false;
      },
      error: (error) => {
        console.error('Erro ao carregar categorias:', error);
        this.loading = false;
      }
    });
  }

  private initializeForm(): void {
    // Initialize sponsors form group if not already done
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

    // Ensure there's at least one sponsor item
    const items = this.sponsorsForm.get("items") as FormArray;
    if (items.length === 0) {
      items.push(this.createSponsorItem());
    }
  }

  // Helper method to get sponsors items form array
  get sponsorItems(): FormArray {
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
    this.sponsorItems.push(this.createSponsorItem())
  }

  // Remove a sponsor item
  removeSponsorItem(index: number): void {
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
          console.log(`Logo uploaded and converted to base64 for sponsor at index ${index}:`, file.name)
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
    this.sponsorItems.at(index).get("logoImage")?.setValue(null)
    // Reset file input
    if (this.fileInput) {
      this.fileInput.nativeElement.value = ''
    }
    console.log(`Logo removed for sponsor at index ${index}`)
  }

  // Helper to get file name for display
  getFileName(file: File | string): string {
    if (typeof file === 'string') {
      return 'Imagem em base64'
    }
    return file ? file.name : ""
  }
}
