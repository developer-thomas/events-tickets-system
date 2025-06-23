import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { ActivatedRoute, Router } from '@angular/router';
import { PageHeaderComponent } from '../../../../../shared/components/page-header/page-header.component';
import { StepOneComponent } from '../new-event/components/step-one/step-one.component';
import { EventService } from '../../event.service';
import { GetOneEvent } from '../../models/GetEventById.interface';
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
      coverImage: [null]
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

        this.isLoading = false;
      },
      error: () => {
        this.toastr.error('Erro ao carregar dados do evento');
        this.isLoading = false;
      }
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

  submit(): void {
    if (!this.eventId) return;
    if (this.eventForm.invalid) {
      this.eventForm.markAllAsTouched();
      return;
    }

    const formData = this.prepareEventFormData();
    this.eventService.updateEvent(this.eventId, formData).subscribe({
      next: () => {
        this.toastr.success('Evento atualizado com sucesso');
        this.router.navigate(['/gerencial/evento']);
      },
      error: (err) => {
        this.toastr.error('Erro ao atualizar evento');
        console.error(err);
      }
    });
  }

  prepareEventFormData(): FormData {
    const formValue = this.eventForm.value;
    const formData = new FormData();

    // Converter data para formato ISO
    const eventDate = this.parseDateToISO(formValue.startDate);

    // Criar objeto data com todos os campos
    const data: any = {
      placeId: formValue.locationId || '',
      numberOfTickets: formValue.ticketQuantity || '',
      eventDate: eventDate,
      name: formValue.eventName || '',
      description: formValue.description || '',
      categoryIds: formValue.categories || []
    };

    // Tratar o valor do preço
    const priceValue = formValue.price;
    if (priceValue) {
      if (typeof priceValue === "string" && priceValue.includes("R$")) {
        const formattedPrice = priceValue.replace("R$ ", "").replace(/\./g, "").replace(",", ".");
        data.value = formattedPrice;
      } else {
        data.value = priceValue.toString();
      }
    } else {
      data.value = '0.00';
    }

    // Adicionar o objeto data como JSON string
    formData.append('data', JSON.stringify(data));

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

  cancel(): void {
    this.router.navigate(['/gerencial/evento']);
  }
}
