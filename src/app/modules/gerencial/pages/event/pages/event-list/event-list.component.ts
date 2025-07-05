import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { CommomTableComponent, TableColumn } from '../../../../../shared/components/commom-table/commom-table.component';
import { PageHeaderComponent } from '../../../../../shared/components/page-header/page-header.component';
import { FilterTableComponent } from '../../../../../shared/components/filter-table/filter-table.component';
import { BaseButtonComponent } from '../../../../../shared/components/base-button/base-button.component';
import { EventService } from '../../event.service';
import { EventsResult } from '../../models/GetAllEvents.interface';
import { ConfirmDialogService } from '../../../../../shared/services/confirm-dialog/confirmDialog.service';

// Interface estendida para incluir as propriedades mapeadas para a tabela
interface EventTableData extends EventsResult {
  location: string
  quantity: number
  price: string
  period: string
  status: string
}

@Component({
  selector: 'app-event-list',
  standalone: true,
  imports: [PageHeaderComponent, FilterTableComponent, BaseButtonComponent, CommomTableComponent],
  templateUrl: './event-list.component.html',
  styleUrl: './event-list.component.scss'
})
export class EventListComponent implements OnInit {
  private router = inject(Router)
  private activatedRoute = inject(ActivatedRoute)
  private eventService = inject(EventService)
  private toastr = inject(ToastrService);
  private confirmDialog = inject(ConfirmDialogService);

  public title = "Evento"
  public pageSession = "Evento"
  public adminRole = signal<string | null>(null)
  public adminId = signal<number | null>(null)

  public eventData = signal<EventTableData[]>([])
  public filteredEvents = computed(() => {
    const search = this.searchTerm()?.toLowerCase() ?? "";
    return this.eventData().filter(event =>
      event.name.toLowerCase().includes(search) ||
      event.location?.toLowerCase().includes(search)
    );
  });
  
  // paginação
  public totalItems = signal<number>(0)
  public currentPage = signal<number>(1);
  public pageSize = signal<number>(10);
  public searchTerm = signal<string | undefined>(undefined)

  public paginatedEvents = computed(() => {
    const start = (this.currentPage() - 1) * this.pageSize();
    const end = start + this.pageSize();
    return this.filteredEvents().slice(start, end);
  });

  public displayedColumns: TableColumn[] = [
    { label: "Nome", key: "name", type: "text" },
    { label: "Local", key: "location", type: "text" },
    { label: "Quantidade", key: "quantity", type: "text" },
    { label: "Valor", key: "price", type: "text" },
    { label: "Período", key: "period", type: "text" },
    { label: "Status", key: "status", type: "text" },
    { label: "", key: "menu", type: "menu" },
  ]

  ngOnInit() {
    this.getAdminRole();
    this.loadEvents();
  }

  private loadEvents() {
    if(this.adminRole() === 'ADMIN') {
      this.getEvents()
    } else {
      this.getEventsByUser();
    }
  }

  private getEvents() {
    this.eventService.getAllEvents().subscribe({
      next: (res) => {
        // Mapear os dados para incluir o nome da localização como uma propriedade separada
        const mappedEvents = res.map((event) => ({
          ...event,
          location: event.eventLocation?.name || "Sem localização", 
          quantity: event.numberOfTickets,
          price: `R$ ${event.value}`,
          period: new Date(event.eventDate).toLocaleDateString("pt-BR"),
          status: event.active ? "Ativo" : "Inativo",
        }))

        this.eventData.set(mappedEvents)
        this.totalItems.set(res.length) 
      },
      error: (err) => {
        console.error("Erro ao buscar eventos:", err)
      },
    })
  }

  private getEventsByUser() {
    this.eventService.getEventsByRepresentative(this.adminId()!).subscribe({
      next: (res) => {
        // Mapeia os eventos do array 'event' dentro do objeto de localização
        const mappedEvents = res.event.map((event) => ({
          id: event.id,
          name: event.name,
          description: event.description,
          value: event.value.toString(),
          eventDate: event.eventDate,
          fileUrl: event.fileUrl,
          numberOfTickets: event.numberOfTickets,
          active: event.active,
          categories: [], 
          timelineEvent: [], 
          eventLocation: {
            id: res.id,
            name: res.name,
            description: res.description,
            addressLocation: {
              lat: 0,
              lng: 0,
              placeId: ''
            }
          },
          isFavorite: false, 
          
          location: res.name, 
          quantity: event.numberOfTickets,
          price: `R$ ${event.value}`,
          period: new Date(event.eventDate).toLocaleDateString("pt-BR"),
          status: event.active ? "Ativo" : "Inativo",
        }))
        
        this.eventData.set(mappedEvents)
        this.totalItems.set(mappedEvents.length)
      },
      error: (err) => {
        console.error("Erro ao buscar eventos:", err)
      },
    })
  }

  public filter(search: string) {
    this.currentPage.set(1);
    this.searchTerm.set(search);
    this.totalItems.set(this.filteredEvents().length);
  }

  handlePageChange(event: { page: number; size: number }) {
    this.currentPage.set(event.page)
    this.pageSize.set(event.size)
    this.loadEvents();
  }

  public gotoDetailPage(row: EventsResult) {
    this.router.navigate([row.id], { relativeTo: this.activatedRoute })
  }

  gotoEditPage(row: EventsResult) {
    this.router.navigate(["/admin/clients/edit", row.id])
  }

  deleteEvent(row: EventsResult) {
    this.confirmDialog.confirm('Confirmar exclusão', 'Você tem certeza que deseja excluir este evento?')
      .then((confirmed) => {
        if (confirmed) {
          this.eventService.deleteEvent(row.id).subscribe({
            next: () => {
              this.toastr.success('Evento deletado com sucesso');
              this.loadEvents();
            },
            error: (err) => {
              console.error('Erro ao excluir evento:', err);
              this.toastr.error('Erro ao excluir evento');
            }
          });
        }
      });
  }

  editEvent(row: any) {
    this.router.navigate(['/gerencial/evento/editar', row.id]);
  }

  getAdminRole() {
    this.adminRole.set(localStorage.getItem('role'));
    this.adminId.set(Number(localStorage.getItem('adminId')));
  }
}
