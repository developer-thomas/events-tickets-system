import { ChangeDetectionStrategy, Component, computed, inject, OnInit, signal } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { CommomTableComponent, TableColumn } from '../../../../../../../shared/components/commom-table/commom-table.component';
import { ClientService } from '../../../../client.service';
import { ActivatedRoute } from '@angular/router';
import { GetUserTicket } from '../../../../models/GetUserTickets.interface';


@Component({
  selector: 'app-tickets-tab',
  standalone: true,
  imports: [MatCardModule, CommomTableComponent],
  template: `
      <div class="p-2">
        <mat-card>
          <mat-card-content>
            <app-commom-table
              [data]="paginatedTicketsData()"
              [displayedColumns]="displayedColumns"
              (pageChange)="handlePageChange($event)"
              [totalItems]="totalItems()"
              [page]="currentPage()"
              [size]="pageSize()"
            ></app-commom-table>
          </mat-card-content>
        </mat-card>
      </div>
   `
})
export class TicketsTabComponent implements OnInit {
  private clientService = inject(ClientService);
  private activatedRoute = inject(ActivatedRoute);
  
  private userId!: any;
  public allTicketsData = signal<GetUserTicket[]>([]);
  public ticketsData = signal<GetUserTicket[]>([]);

  // paginação
  public totalItems = signal<number>(0);
  public currentPage = signal<number>(1);
  public pageSize = signal<number>(10);
  public searchTerm = signal<string | undefined>(undefined);

  public filteredTicketsData = computed(() => {
    const term = this.searchTerm()?.toLowerCase();
    if (!term) return this.allTicketsData();

    return this.allTicketsData().filter(ticket => 
      ticket.event?.name?.toLowerCase().includes(term) ||
      ticket.event?.eventLocation?.name?.toLowerCase().includes(term) ||
      ticket.status?.toLowerCase().includes(term) ||
      ticket.value?.toString().includes(term)
    );
  });

  public paginatedTicketsData = computed(() => {
    const start = (this.currentPage() - 1) * this.pageSize();
    const end = start + this.pageSize();
    return this.filteredTicketsData().slice(start, end);
  });

  public displayedColumns: TableColumn[] = [
    { label: 'Comprado em', key: 'createdAt', type: 'date' },
    { label: 'Local', key: 'locationName', type: 'text' },
    { label: 'Evento', key: 'eventName', type: 'text' },
    { label: 'Valor', key: 'value', type: 'text' },
    { label: 'Status', key: 'status', type: 'text' },
  ];

  ngOnInit(): void {
    const userId = this.activatedRoute.snapshot.params['id'];

    if(userId) {
      this.userId = userId;
      this.fetchData()
    }
  }

  fetchData() {
    this.clientService.getUserTickets(this.userId).subscribe({
      next: (tickets) => {
        const transformedData:any = tickets.map((ticket) => ({
          ...ticket,
          locationName: ticket.event.eventLocation.name ?? '',
          eventName: ticket.event.name,
          createdAt: ticket.createdAt,
          status: ticket.status === 'USED' ? 'Usado' : 'Válido'
        }))

        this.allTicketsData.set(transformedData);
        this.totalItems.set(transformedData.length);
      },
      error: (error) => {
        console.error('Erro ao carregar ingressos:', error);
      }
    })
  }

  public filter(search: string) {
    this.currentPage.set(1); // sempre volta pra primeira página
    this.searchTerm.set(search);
    this.totalItems.set(this.filteredTicketsData().length);
  }

  // Manipular mudanças de página
  public handlePageChange(event: {page: number, size: number}) {
    this.currentPage.set(event.page);
    this.pageSize.set(event.size);
  }
}
