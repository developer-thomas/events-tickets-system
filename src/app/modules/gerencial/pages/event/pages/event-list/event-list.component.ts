import { Component, inject, OnInit, signal } from '@angular/core';
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

  public eventData = signal<EventTableData[]>([])

  // paginação
  public totalItems = signal<number>(0)
  public currentPage = signal<number>(0)
  public pageSize = signal<number>(10) // Definindo um valor padrão
  public searchTerm = signal<string | undefined>(undefined)

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
    this.getEvents()
  }

  private getEvents(search?: string) {
    if (search) {
      this.searchTerm.set(search)
    }

    this.eventService.getAllEvents(this.currentPage(), this.pageSize(), this.searchTerm()).subscribe({
      next: (res) => {
        // Mapear os dados para incluir o nome da localização como uma propriedade separada
        const mappedEvents = res.result.map((event) => ({
          ...event,
          location: event.eventLocation?.name || "Sem localização", // Adiciona a propriedade location com o nome da localização
          quantity: event.numberOfTickets,
          price: `R$ ${event.value}`,
          period: new Date(event.eventDate).toLocaleDateString("pt-BR"),
          status: event.active ? "Ativo" : "Inativo",
        }))

        this.eventData.set(mappedEvents)
        this.totalItems.set(res.result.length) // Temporário, ajuste conforme necessário
      },
      error: (err) => {
        console.error("Erro ao buscar eventos:", err)
      },
    })
  }

  public filter(search: string) {
    this.getEvents(search)
  }

  handlePageChange(event: { page: number; size: number }) {
    this.currentPage.set(event.page)
    this.pageSize.set(event.size)
    this.getEvents()
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
              this.getEvents();
            },
            error: (err) => {
              console.error('Erro ao excluir evento:', err);
              this.toastr.error('Erro ao excluir evento');
            }
          });
        }
      });
  }
}
