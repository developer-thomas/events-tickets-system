import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormsModule, ReactiveFormsModule, FormArray } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';
import { PageHeaderComponent } from '../../../../../shared/components/page-header/page-header.component';
import { StepOneComponent } from './components/step-one/step-one.component';
import { StepThreeComponent } from './components/step-three/step-three.component';
import { StepTwoComponent } from './components/step-two/step-two.component';
import { EventService } from '../../event.service';
import { CreateEventResponse, CreateEventTimeline, CreateSponsor } from '../../models/CreateEvent.interface';
import { parse } from "date-fns"

@Component({
  selector: 'app-new-event',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatIconModule,
    PageHeaderComponent,
    StepOneComponent,
    StepTwoComponent,
    StepThreeComponent,],
  templateUrl: './new-event.component.html',
  styleUrl: './new-event.component.scss'
})
export class NewEventComponent {
  private fb = inject(FormBuilder)
  private router = inject(Router)
  private eventService = inject(EventService)

  currentStep = 1
  totalSteps = 3
  eventForm: FormGroup
  createdEventId: number | null = null

  constructor() {
    this.eventForm = this.fb.group({
      // Step 1 - Event Data
      eventName: ["", Validators.required],
      locationId: ["", Validators.required],
      description: ["", Validators.required],
      startDate: ["", Validators.required],
      endDate: ["", Validators.required],
      price: ["", Validators.required],
      ticketQuantity: ["", [Validators.required, Validators.min(1)]],
      categories: [[]],
      coverImage: [null],

      // Step 2 - Schedule - inicializar com um grupo vazio
      schedule: this.fb.group({
        items: this.fb.array([]),
      }),

      // Step 3 - Sponsors
      sponsors: this.fb.group({
        items: this.fb.array([]),
      }),
    })
  }

  nextStep(): void {
    if (this.currentStep < this.totalSteps) {
      // Validate current step before proceeding
      if (this.validateCurrentStep()) {
        if (this.currentStep === 1) {
          // Submit event data and get event ID for next steps
          this.submitEventData()
        } else if (this.currentStep === 2) {
          // Submit schedule data
          this.submitScheduleData()
        } else {
          this.currentStep++
        }
      }
    } else {
      // Submit sponsors data and complete the form
      this.submitSponsorsData()
    }
  }

  previousStep(): void {
    if (this.currentStep > 1) {
      this.currentStep--
    }
  }

  validateCurrentStep(): boolean {
    if (this.currentStep === 1) {
      const step1Controls = [
        "eventName",
        "locationId",
        "description",
        "startDate",
        "endDate",
        "price",
        "ticketQuantity",
      ]
      return this.validateControls(step1Controls)
    } else if (this.currentStep === 2) {
      // Validar o formulário de cronograma
      const scheduleForm = this.eventForm.get("schedule") as FormGroup
      if (scheduleForm) {
        const items = scheduleForm.get("items") as FormArray
        if (items && items.length > 0) {
          let valid = true
          for (let i = 0; i < items.length; i++) {
            const item = items.at(i) as FormGroup
            if (item.invalid) {
              this.markFormGroupTouched(item)
              valid = false
            }
          }
          return valid
        }
      }
      return true
    } else if (this.currentStep === 3) {
      const sponsorsForm = this.eventForm.get("sponsors") as FormGroup
      if (sponsorsForm) {
        const items = sponsorsForm.get("items") as FormArray
        if (items && items.length > 0) {
          let valid = true
          for (let i = 0; i < items.length; i++) {
            const item = items.at(i) as FormGroup
            if (item.invalid) {
              this.markFormGroupTouched(item)
              valid = false
            }
          }
          return valid
        }
      }
      return true
    }
    return true
  }

  validateControls(controlNames: string[]): boolean {
    let valid = true
    for (const name of controlNames) {
      const control = this.eventForm.get(name)
      if (control && control.invalid) {
        control.markAsTouched()
        valid = false
      }
    }
    return valid
  }

  // Método atualizado para lidar com o formato sem barras (DDMMYYYY)
  formatDateToISO(dateString: string): string {
    try {
      if (!dateString || typeof dateString !== "string") {
        console.error("Invalid date string:", dateString)
        return new Date().toISOString()
      }

      console.log("Original date string:", dateString)

      // Verificar se a string tem 8 caracteres (formato DDMMYYYY)
      if (dateString.length === 8 && !dateString.includes("/")) {
        // Extrair dia, mês e ano
        const day = dateString.substring(0, 2)
        const month = dateString.substring(2, 4)
        const year = dateString.substring(4, 8)

        // Criar uma data no formato YYYY-MM-DD
        const formattedDate = `${year}-${month}-${day}T12:00:00.000Z`
        console.log("Formatted date from DDMMYYYY:", formattedDate)

        // Verificar se a data é válida
        const date = new Date(formattedDate)
        if (isNaN(date.getTime())) {
          console.error("Invalid date after formatting:", formattedDate)
          return new Date().toISOString()
        }

        return formattedDate
      }
      // Se tiver barras, usar o date-fns para parse
      else if (dateString.includes("/")) {
        const parsedDate = parse(dateString, "dd/MM/yyyy", new Date())

        // Verificar se a data é válida
        if (isNaN(parsedDate.getTime())) {
          console.error("Invalid date after parsing with date-fns:", dateString)
          return new Date().toISOString()
        }

        return parsedDate.toISOString()
      }
      // Caso não seja nenhum dos formatos esperados
      else {
        console.error("Unrecognized date format:", dateString)
        return new Date().toISOString()
      }
    } catch (error) {
      console.error("Error formatting date:", error, "for date string:", dateString)
      return new Date().toISOString()
    }
  }

  // Método para formatar horários para o formato HH:MM
  formatTimeWithColon(timeStr: string): string {
    if (!timeStr) return "00:00"

    // Remover qualquer dois pontos existente
    timeStr = timeStr.replace(":", "")

    // Garantir que temos 4 dígitos
    while (timeStr.length < 4) {
      timeStr = "0" + timeStr
    }

    // Formatar como HH:MM
    return timeStr.substring(0, 2) + ":" + timeStr.substring(2, 4)
  }

  submitEventData(): void {
    // Format data for API using FormData for multipart/form-data
    const formData = new FormData()

    // Add text fields
    formData.append("name", this.eventForm.value.eventName)
    formData.append("description", this.eventForm.value.description)

    // Format price - ensure it's always sent with a valid value as string
    const priceValue = this.eventForm.value.price
    if (priceValue) {
      // Check if it's a string and contains R$
      if (typeof priceValue === "string" && priceValue.includes("R$")) {
        // Remove R$ prefix, replace dots with empty string, and replace comma with dot
        const formattedPrice = priceValue.replace("R$ ", "").replace(/\./g, "").replace(",", ".")
        console.log("Formatted price:", formattedPrice) // Debug log
        formData.append("value", formattedPrice)
      } else {
        // Just convert to string if it's a number or already formatted
        formData.append("value", priceValue.toString())
      }
    } else {
      // Default value if not provided - as string
      formData.append("value", "50.00")
      console.log("Using default price: 50.00")
    }

    // Obter os valores das datas diretamente do formulário
    const startDateValue = this.eventForm.get("startDate")?.value
    const endDateValue = this.eventForm.get("endDate")?.value

    console.log("Raw start date:", startDateValue)
    console.log("Raw end date:", endDateValue)

    // Formatar as datas para ISO usando o método atualizado
    const eventDate = this.formatDateToISO(startDateValue)
    const deletedAt = this.formatDateToISO(endDateValue)

    console.log("Formatted event date:", eventDate)
    console.log("Formatted deleted at:", deletedAt)

    // Adicionar as datas ao FormData
    formData.append("eventDate", eventDate)
    // formData.append("deletedAt", deletedAt)

    // Add number fields - ensure they are always sent
    formData.append("numberOfTickets", this.eventForm.value.ticketQuantity || "0")
    formData.append("placeId", this.eventForm.value.locationId || "0")

    // Add categories - ensure they are always sent
    const categories = this.eventForm.value.categories
    if (Array.isArray(categories) && categories.length > 0) {
      categories.forEach((categoryId) => {
        formData.append("categoryIds", categoryId)
      })
    } else if (categories) {
      formData.append("categoryIds", categories)
    } else {
      // Ensure at least one categoryIds is sent
      formData.append("categoryIds", "1") // Default category ID
    }

    // Add image file
    const coverImage = this.eventForm.value.coverImage
    if (coverImage instanceof File) {
      formData.append("file", coverImage, coverImage.name)
    }

    // Log the FormData entries for debugging
    formData.forEach((value, key) => {
      console.log(`${key}: ${value}`)
    })

    // Send data to API
    this.eventService.createEvent(formData).subscribe({
      next: (response: CreateEventResponse) => {
        console.log("Event created successfully:", response)
        this.createdEventId = response.result.id
        this.currentStep++
      },
      error: (error) => {
        console.error("Error creating event:", error)
      },
    })
  }

  submitScheduleData(): void {
    if (!this.createdEventId) {
      console.error("Event ID is missing. Cannot submit schedule data.")
      return
    }

    const scheduleForm = this.eventForm.get("schedule") as FormGroup
    const items = scheduleForm.get("items") as FormArray

    if (items && items.length > 0) {
      // Criar o array de timelines
      const timelines = []

      // Para cada item do cronograma, formatar os dados
      for (let i = 0; i < items.length; i++) {
        const item = items.at(i).value

        try {
          // Formatar a data
          const dateStr = item.date // formato DD/MM/YY

          // Verificar se a data está no formato esperado
          if (!dateStr || dateStr.length < 6) {
            console.error("Invalid date format:", dateStr)
            continue
          }

          // Extrair componentes da data com tratamento de erro
          let day, month, year

          if (dateStr.includes("/")) {
            // Formato DD/MM/YY
            const parts = dateStr.split("/")
            if (parts.length !== 3) {
              console.error("Invalid date parts:", parts)
              continue
            }
            day = parts[0].padStart(2, "0")
            month = parts[1].padStart(2, "0")
            year = parts[2].length === 2 ? "20" + parts[2] : parts[2]
          } else {
            // Formato DDMMYY
            day = dateStr.substring(0, 2)
            month = dateStr.substring(2, 4)
            year = dateStr.length === 6 ? "20" + dateStr.substring(4, 6) : dateStr.substring(4)
          }

          // Usar a data atual como fallback
          const currentDate = new Date()
          const isoDate = `${year || currentDate.getFullYear()}-${month || String(currentDate.getMonth() + 1).padStart(2, "0")}-${day || String(currentDate.getDate()).padStart(2, "0")}T12:00:00.000Z`

          console.log("Formatted date:", isoDate)

          // Formatar os horários para incluir os dois pontos
          const formattedInitHour = this.formatTimeWithColon(item.initHour)
          const formattedFinishHour = this.formatTimeWithColon(item.finishHour)

          console.log("Formatted init hour:", formattedInitHour)
          console.log("Formatted finish hour:", formattedFinishHour)

          // Adicionar o item ao array de timelines
          timelines.push({
            date: isoDate,
            initHour: formattedInitHour,
            finishHour: formattedFinishHour,
            description: item.description || "Sem descrição",
          })
        } catch (error) {
          console.error("Error processing timeline item:", error)
          // Adicionar um item com valores padrão em caso de erro
          timelines.push({
            date: new Date().toISOString(),
            initHour: "00:00",
            finishHour: "23:59",
            description: item.description || "Sem descrição",
          })
        }
      }

      // Criar o objeto de dados para enviar ao backend
      const scheduleData = {
        eventId: this.createdEventId,
        timelines: timelines,
      }

      console.log("Submitting schedule data:", scheduleData)

      // Enviar os dados para o backend
      this.eventService.createEventTimelines(scheduleData).subscribe({
        next: (response) => {
          console.log("Schedule data submitted successfully:", response)
          this.currentStep++
        },
        error: (error) => {
          console.error("Error submitting schedule data:", error)
        },
      })
    } else {
      // Se não houver itens, avançar para o próximo passo
      console.log("No schedule items to submit")
      this.currentStep++
    }
  }

  submitSponsorsData(): void {
    if (!this.createdEventId) {
      console.error("Event ID is missing. Cannot submit sponsors data.")
      return
    }

    const sponsorsForm = this.eventForm.get("sponsors") as FormGroup
    const items = sponsorsForm.get("items") as FormArray

    if (items && items.length > 0) {
      // Processar cada patrocinador individualmente
      const sponsorPromises: Promise<any>[] = []

      for (let i = 0; i < items.length; i++) {
        const item = items.at(i).value

        // Verificar se os campos obrigatórios estão preenchidos
        if (!item.name || !item.categoryId || !item.description) {
          console.log(`Skipping sponsor at index ${i} due to missing required fields`)
          continue
        }

        // Verificar se o base64 é válido
        const imageUrl = item.logoImage && typeof item.logoImage === 'string' && item.logoImage.length > 0
          ? item.logoImage
          : ""

        // Criar o objeto de dados para enviar ao backend
        const sponsorData: CreateSponsor = {
          sponsors: [{
            name: item.name,
            categoryIds: [Number.parseInt(item.categoryId)],
            description: item.description,
            imageUrl: imageUrl,
            eventId: this.createdEventId!
          }]
        }

        console.log(`Submitting sponsor data for ${item.name}:`, {
          ...sponsorData,
          sponsors: sponsorData.sponsors.map(s => ({
            ...s,
            imageUrl: s.imageUrl ? `${s.imageUrl.substring(0, 50)}...` : ""
          }))
        })

        // Enviar os dados para o backend
        sponsorPromises.push(this.eventService.createSponsor(sponsorData).toPromise())
      }

      // Aguardar todas as promessas serem resolvidas
      Promise.all(sponsorPromises)
        .then(() => {
          console.log("All sponsors submitted successfully")
          this.router.navigate(["/gerencial/events"])
        })
        .catch((error) => {
          console.error("Error submitting sponsors:", error)
        })
    } else {
      // Se não houver patrocinadores, finalizar o processo
      console.log("No sponsors to submit")
      this.router.navigate(["/gerencial/events"])
    }
  }

  submitForm(): void {
    if (this.eventForm.valid) {
      console.log("Form submitted:", this.eventForm.value)
      // Submit form data to backend
      this.router.navigate(["/gerencial/events"])
    } else {
      // Mark all fields as touched to trigger validation messages
      this.markFormGroupTouched(this.eventForm)
    }
  }

  // Helper method to mark all controls as touched
  private markFormGroupTouched(formGroup: FormGroup): void {
    Object.values(formGroup.controls).forEach((control) => {
      control.markAsTouched()

      if ((control as any).controls) {
        this.markFormGroupTouched(control as FormGroup)
      }
    })
  }

  cancel(): void {
    this.router.navigate(["/gerencial/events"])
  }
}
