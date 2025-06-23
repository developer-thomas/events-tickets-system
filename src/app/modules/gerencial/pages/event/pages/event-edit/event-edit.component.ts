import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormsModule, ReactiveFormsModule, FormArray } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { ActivatedRoute, Router } from '@angular/router';
import { PageHeaderComponent } from '../../../../../shared/components/page-header/page-header.component';
import { StepOneComponent } from '../new-event/components/step-one/step-one.component';
import { StepTwoComponent } from '../new-event/components/step-two/step-two.component';
import { StepThreeComponent } from '../new-event/components/step-three/step-three.component';
import { EventService } from '../../event.service';
import { GetOneEvent } from '../../models/GetEventById.interface';
import { UpdateEventTimeline } from '../../models/UpdateEventTimeline.interface';
import { UpdateEventSponsor } from '../../models/UpdateEventSponsor.interface';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-event-edit',
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
    StepThreeComponent,
  ],
  templateUrl: './event-edit.component.html',
  styleUrl: './event-edit.component.scss'
})
export class EventEditComponent implements OnInit {
  private fb = inject(FormBuilder);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private eventService = inject(EventService);
  private toastr = inject(ToastrService);

  currentStep = 1;
  totalSteps = 3;
  eventForm: FormGroup;
  eventId: number | null = null;
  isLoading = false;
  eventFile: File | null = null;

  constructor() {
    this.eventForm = this.fb.group({
      eventName: ['', Validators.required],
      locationId: ['', Validators.required],
      description: ['', Validators.required],
      startDate: ['', Validators.required],
      endDate: ['', Validators.required],
      price: ['', Validators.required],
      ticketQuantity: ['', [Validators.required, Validators.min(1)]],
      categories: [[]],
      coverImage: [null],

      // Step 2 - Schedule
      schedule: this.fb.group({
        items: this.fb.array([]),
      }),

      // Step 3 - Sponsors
      sponsors: this.fb.group({
        items: this.fb.array([]),
      }),

      // Dados originais para atualização
      originalTimelineEvents: [[]],
      originalSponsors: [[]],
    });
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.eventId = +id;
        this.fetchEventData(this.eventId);
      }
    });
  }

  fetchEventData(id: number): void {
    this.isLoading = true;
    this.eventService.getOneEvent(id).subscribe({
      next: (event) => {
        // Converter a data ISO para o formato DD/MM/YYYY
        const eventDate = new Date(event.eventDate);
        const formattedDate = this.formatDateForInput(eventDate);
        
        this.eventForm.patchValue({
          eventName: event.name,
          locationId: event.eventLocation?.id || '',
          description: event.description,
          startDate: formattedDate,
          endDate: formattedDate, // Assumindo que é o mesmo dia, ajuste se necessário
          price: event.value,
          ticketQuantity: 5000, // Valor padrão, ajuste se necessário
          categories: event.categories?.map(c => c.id) || [],
        });

        // Carregar dados do cronograma (Step 2)
        this.loadTimelineData(event.timelineEvent || []);

        // Carregar dados dos patrocinadores (Step 3)
        this.loadSponsorsData(event.eventSponsor || []);

        // Salvar dados originais para atualização
        this.eventForm.patchValue({
          originalTimelineEvents: event.timelineEvent || [],
          originalSponsors: event.eventSponsor || []
        });

        this.isLoading = false;
      },
      error: () => {
        this.toastr.error('Erro ao carregar dados do evento');
        this.isLoading = false;
      }
    });
  }

  loadTimelineData(timelineEvents: any[]): void {
    console.log('Timeline events from backend:', timelineEvents);
    
    const scheduleForm = this.eventForm.get('schedule') as FormGroup;
    const items = scheduleForm.get('items') as FormArray;
    
    // Limpar array existente
    while (items.length !== 0) {
      items.removeAt(0);
    }

    // Adicionar itens do cronograma
    timelineEvents.forEach(timeline => {
      console.log('Processing timeline:', timeline);
      console.log('Original hourInit:', timeline.hourInit);
      console.log('Original hourFinish:', timeline.hourFinish);
      
      const timelineGroup = this.fb.group({
        date: [this.formatDateForInput(new Date(timeline.date)), Validators.required],
        initHour: [timeline.hourInit || '', Validators.required],
        finishHour: [timeline.hourFinish || '', Validators.required],
        description: [timeline.description, Validators.required],
      });
      items.push(timelineGroup);
    });
    
    console.log('Final schedule items:', items.value);
  }

  loadSponsorsData(sponsors: any[]): void {
    const sponsorsForm = this.eventForm.get('sponsors') as FormGroup;
    const items = sponsorsForm.get('items') as FormArray;
    
    // Limpar array existente
    while (items.length !== 0) {
      items.removeAt(0);
    }

    // Adicionar patrocinadores
    sponsors.forEach(sponsor => {
      const sponsorGroup = this.fb.group({
        name: [sponsor.name, Validators.required],
        categoryId: [sponsor.categoryIds?.[0] || '', Validators.required],
        description: [sponsor.description, Validators.required],
        logoImage: [null],
      });
      items.push(sponsorGroup);
    });
  }

  formatDateForInput(date: Date): string {
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length) {
      this.eventFile = input.files[0];
      this.eventForm.patchValue({ coverImage: this.eventFile });
    }
  }

  nextStep(): void {
    if (this.currentStep < this.totalSteps) {
      if (this.validateCurrentStep()) {
        if (this.currentStep === 1) {
          this.submitEventData();
        } else if (this.currentStep === 2) {
          this.submitScheduleData();
        } else {
          this.currentStep++;
        }
      }
    } else {
      this.submitSponsorsData();
    }
  }

  previousStep(): void {
    if (this.currentStep > 1) {
      this.currentStep--;
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
      ];
      return this.validateControls(step1Controls);
    } else if (this.currentStep === 2) {
      const scheduleForm = this.eventForm.get("schedule") as FormGroup;
      if (scheduleForm) {
        const items = scheduleForm.get("items") as FormArray;
        if (items && items.length > 0) {
          let valid = true;
          for (let i = 0; i < items.length; i++) {
            const item = items.at(i) as FormGroup;
            if (item.invalid) {
              this.markFormGroupTouched(item);
              valid = false;
            }
          }
          return valid;
        }
      }
      return true;
    } else if (this.currentStep === 3) {
      const sponsorsForm = this.eventForm.get("sponsors") as FormGroup;
      if (sponsorsForm) {
        const items = sponsorsForm.get("items") as FormArray;
        if (items && items.length > 0) {
          let valid = true;
          for (let i = 0; i < items.length; i++) {
            const item = items.at(i) as FormGroup;
            if (item.invalid) {
              this.markFormGroupTouched(item);
              valid = false;
            }
          }
          return valid;
        }
      }
      return true;
    }
    return true;
  }

  validateControls(controlNames: string[]): boolean {
    let valid = true;
    for (const name of controlNames) {
      const control = this.eventForm.get(name);
      if (control && control.invalid) {
        control.markAsTouched();
        valid = false;
      }
    }
    return valid;
  }

  submitEventData(): void {
    if (!this.eventId) return;
    
    const formData = this.prepareEventFormData();
    this.eventService.updateEvent(this.eventId, formData).subscribe({
      next: () => {
        this.toastr.success('Evento atualizado com sucesso');
        this.currentStep++;
      },
      error: (err) => {
        this.toastr.error('Erro ao atualizar evento');
        console.error(err);
      }
    });
  }

  submitScheduleData(): void {
    if (!this.eventId) return;
    
    const scheduleForm = this.eventForm.get("schedule") as FormGroup;
    const items = scheduleForm.get("items") as FormArray;

    if (items && items.length > 0) {
      const updatePromises: Promise<any>[] = [];

      for (let i = 0; i < items.length; i++) {
        const item = items.at(i).value;
        const dateStr = item.date;
        
        if (!dateStr || dateStr.length < 6) {
          console.error("Invalid date format:", dateStr);
          continue;
        }

        let day, month, year;
        if (dateStr.includes("/")) {
          const parts = dateStr.split("/");
          if (parts.length !== 3) {
            console.error("Invalid date parts:", parts);
            continue;
          }
          day = parts[0].padStart(2, "0");
          month = parts[1].padStart(2, "0");
          year = parts[2].length === 2 ? "20" + parts[2] : parts[2];
        } else {
          day = dateStr.substring(0, 2);
          month = dateStr.substring(2, 4);
          year = dateStr.length === 6 ? "20" + dateStr.substring(4, 6) : dateStr.substring(4);
        }

        const currentDate = new Date();
        const isoDate = `${year || currentDate.getFullYear()}-${month || String(currentDate.getMonth() + 1).padStart(2, "0")}-${day || String(currentDate.getDate()).padStart(2, "0")}T12:00:00.000Z`;

        const timeStr = item.initHour || "00:00";
        const finishTimeStr = item.finishHour || "00:00";

        // Buscar o ID do timeline do evento carregado
        const timelineEvent = this.eventForm.get('originalTimelineEvents')?.value?.[i];
        if (timelineEvent?.id) {
          const updateData: UpdateEventTimeline = {
            date: isoDate,
            hourInit: timeStr,
            hourFinish: finishTimeStr,
            description: item.description,
            eventId: this.eventId
          };

          const promise = this.eventService.updateEventTimeline(timelineEvent.id, updateData).toPromise();
          updatePromises.push(promise);
        }
      }

      if (updatePromises.length > 0) {
        Promise.all(updatePromises)
          .then(() => {
            this.toastr.success('Cronograma atualizado com sucesso');
            this.currentStep++;
          })
          .catch((error) => {
            console.error("Error updating schedule:", error);
            this.toastr.error('Erro ao atualizar cronograma');
          });
      } else {
        this.currentStep++;
      }
    } else {
      this.currentStep++;
    }
  }

  submitSponsorsData(): void {
    if (!this.eventId) return;
    
    const sponsorsForm = this.eventForm.get("sponsors") as FormGroup;
    const items = sponsorsForm.get("items") as FormArray;

    if (items && items.length > 0) {
      const updatePromises: Promise<any>[] = [];

      for (let i = 0; i < items.length; i++) {
        const item = items.at(i).value;
        
        if (item.name && item.categoryId && item.description) {
          // Buscar o ID do patrocinador do evento carregado
          const originalSponsor = this.eventForm.get('originalSponsors')?.value?.[i];
          if (originalSponsor?.id) {
            const updateData: UpdateEventSponsor = {
              name: item.name,
              description: item.description,
              imageUrl: item.logoImage || "",
              eventId: this.eventId
            };

            const promise = this.eventService.updateEventSponsor(originalSponsor.id, updateData).toPromise();
            updatePromises.push(promise);
          }
        }
      }

      if (updatePromises.length > 0) {
        Promise.all(updatePromises)
          .then(() => {
            this.toastr.success('Patrocinadores atualizados com sucesso');
            this.router.navigate(['/gerencial/evento']);
          })
          .catch((error) => {
            console.error("Error updating sponsors:", error);
            this.toastr.error('Erro ao atualizar patrocinadores');
          });
      } else {
        this.router.navigate(['/gerencial/evento']);
      }
    } else {
      this.router.navigate(['/gerencial/evento']);
    }
  }

  formatTimeWithColon(timeStr: string): string {
    if (!timeStr) return "00:00";
    timeStr = timeStr.replace(":", "");
    while (timeStr.length < 4) {
      timeStr = "0" + timeStr;
    }
    return timeStr.substring(0, 2) + ":" + timeStr.substring(2, 4);
  }

  prepareEventFormData(): FormData {
    const formValue = this.eventForm.value;
    const formData = new FormData();

    // Converter data para formato ISO
    const eventDate = this.parseDateToISO(formValue.startDate);

    // Adicionar campos diretamente ao FormData
    formData.append('placeId', formValue.locationId || '');
    formData.append('numberOfTickets', formValue.ticketQuantity || '');
    formData.append('eventDate', eventDate);
    formData.append('name', formValue.eventName || '');
    formData.append('description', formValue.description || '');

    // Adicionar categorias
    const categories = formValue.categories || [];
    if (Array.isArray(categories) && categories.length > 0) {
      categories.forEach((categoryId: any) => {
        formData.append('categoryIds', categoryId);
      });
    } else {
      formData.append('categoryIds', '1'); // Default category ID
    }

    // Tratar o valor do preço
    const priceValue = formValue.price;
    if (priceValue) {
      if (typeof priceValue === "string" && priceValue.includes("R$")) {
        const formattedPrice = priceValue.replace("R$ ", "").replace(/\./g, "").replace(",", ".");
        formData.append('value', formattedPrice);
      } else {
        formData.append('value', priceValue.toString());
      }
    } else {
      formData.append('value', '0.00');
    }

    // Adicionar arquivo separadamente se existir
    if (this.eventFile) {
      formData.append('file', this.eventFile, this.eventFile.name);
    }

    return formData;
  }

  parseDateToISO(dateStr: string): string {
    if (!dateStr) return new Date().toISOString();
    
    const [day, month, year] = dateStr.split('/');
    
    const date = new Date(+year, +month - 1, +day, 12, 0); // Meio-dia como padrão
    return date.toISOString();
  }

  private markFormGroupTouched(formGroup: FormGroup): void {
    Object.values(formGroup.controls).forEach((control) => {
      control.markAsTouched();

      if ((control as any).controls) {
        this.markFormGroupTouched(control as FormGroup);
      }
    });
  }

  cancel(): void {
    this.router.navigate(['/gerencial/evento']);
  }
}
