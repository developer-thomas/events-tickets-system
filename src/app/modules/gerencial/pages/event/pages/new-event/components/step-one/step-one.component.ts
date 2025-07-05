import { CommonModule } from '@angular/common';
import { Component, inject, Input, OnInit, Output, EventEmitter, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { NgxMaskDirective } from 'ngx-mask';
import { EventService } from '../../../../event.service';
import { GetLocationsNames, GetCategoriesNames } from '../../../../models/CreateEvent.interface';


@Component({
  selector: 'app-step-one',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatInputModule,
    MatFormFieldModule,
    MatSelectModule,
    MatIconModule,
    NgxMaskDirective,],
  templateUrl: './step-one.component.html',
  styleUrl: './step-one.component.scss'
})
export class StepOneComponent implements OnInit{
  @Input() formGroup!: FormGroup
  @Output() coverImageSelected = new EventEmitter<File>();

  private eventService = inject(EventService)

  locations = signal<GetLocationsNames[]>([])
  categories = signal<GetCategoriesNames[]>([])

  selectedCategories: number[] = []
  coverImageFile: File | null = null

  ngOnInit(): void {
    this.loadLocations()
    this.loadCategories()

    // Escutar mudanças no campo categories para atualizar selectedCategories
    const categoriesControl = this.getFormControl('categories');
    if (categoriesControl) {
      categoriesControl.valueChanges.subscribe(value => {
        if (value && Array.isArray(value)) {
          this.selectedCategories = value;
        }
      })

      // Inicializar selectedCategories com o valor atual se existir
      const categoryId = categoriesControl.value
      if (categoryId && Array.isArray(categoryId) && categoryId.length > 0) {
        this.selectedCategories = categoryId
      }
    }
  }

  loadLocations(): void {
    this.eventService.getLocationsNames().subscribe({
      next: (data) => {
        this.locations.set(data)
      },
      error: (error) => {
        console.error("Error loading locations:", error)
      },
    })
  }

  loadCategories(): void {
    this.eventService.getCategoriesNames().subscribe({
      next: (data) => {
        this.categories.set(data)
      },
      error: (error) => {
        console.error("Error loading categories:", error)
      },
    })
  }

  getFormControl(name: string): FormControl {
    const control = this.formGroup.get(name) as FormControl;
    if (!control) {
      console.error(`FormControl '${name}' not found in formGroup`);
      // Retornar um FormControl vazio como fallback
      return new FormControl();
    }
    return control;
  }

  // Método para garantir que as datas tenham o formato correto
  formatDateInput(controlName: string): void {
    const control = this.getFormControl(controlName)
    if (control && control.value) {
      const value = control.value

      // Se a data não tiver barras, adicione-as
      if (value.length === 8 && !value.includes("/")) {
        const day = value.substring(0, 2)
        const month = value.substring(2, 4)
        const year = value.substring(4, 8)

        // Formatar como DD/MM/YYYY
        const formattedDate = `${day}/${month}/${year}`
        console.log(`Reformatting ${controlName} from ${value} to ${formattedDate}`)

        // Atualizar o valor no controle
        control.setValue(formattedDate, { emitEvent: false })
      }
    }
  }

  toggleCategory(categoryId: number): void {
    const index = this.selectedCategories.indexOf(categoryId)
    if (index !== -1) {
      // Remove if already selected
      this.selectedCategories.splice(index, 1)
    } else {
      // Add if not selected
      this.selectedCategories.push(categoryId)
    }
    this.getFormControl("categories").setValue(this.selectedCategories)
  }

  isCategorySelected(categoryId: number): boolean {
    return this.selectedCategories.includes(categoryId)
  }

  onCoverImageSelected(event: Event): void {
    const input = event.target as HTMLInputElement
    if (input.files && input.files.length) {
      this.coverImageFile = input.files[0]
      this.getFormControl("coverImage").setValue(this.coverImageFile)
      // Emitir o evento para o componente pai
      this.coverImageSelected.emit(this.coverImageFile)
    }
  }
}
