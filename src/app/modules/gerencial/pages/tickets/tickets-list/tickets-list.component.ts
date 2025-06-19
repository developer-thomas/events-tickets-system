import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { DashboardViewComponent } from './dashboard-view/dashboard-view.component';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { PageHeaderComponent } from '../../../../shared/components/page-header/page-header.component';
import { CommomTableComponent, TableColumn } from '../../../../shared/components/commom-table/commom-table.component';
import { Router, ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { MatMenuModule } from '@angular/material/menu';
import { TicketsService } from '../tickets.service';
import { GetAllTickets } from '../models/GetAllTickets.interface';
import { FilterTableComponent } from '../../../../shared/components/filter-table/filter-table.component';

type ViewMode = "list" | "dashboard"

@Component({
  selector: 'app-tickets-list',
  standalone: true,
  imports: [
    CommonModule, 
    MatButtonModule, 
    MatIconModule, 
    PageHeaderComponent, 
    DashboardViewComponent, 
    CommomTableComponent, 
    MatMenuModule, 
    MatButtonModule, 
    MatIconModule,
    FilterTableComponent
  ],
  templateUrl: './tickets-list.component.html',
  styleUrl: './tickets-list.component.scss'
})
export class TicketsListComponent implements OnInit{
  private router = inject(Router);
  private toastr = inject(ToastrService);
  private activatedRoute = inject(ActivatedRoute);
  private ticketsService = inject(TicketsService);

  viewMode: ViewMode = "list";

  public searchTerm = signal<string | undefined>(undefined);

  public allTickets = signal<GetAllTickets[]>([]);
  public filteredTickets = signal<GetAllTickets[]>([]);

  // paginação
  public totalItems = signal<number>(0);
  public currentPage = signal<number>(1);
  public pageSize = signal<number>(10);

  public displayedColumns: TableColumn[] = [
    { label: 'ID', key: 'id', type: 'text' },
    { label: 'Usuário', key: 'userName', type: 'text' },
    { label: 'Nome do evento', key: 'eventName', type: 'text' },
    { label: 'Nome do local', key: 'eventLocationName', type: 'text' },
    { label: 'Valor', key: 'value', type: 'text' },
    { label: 'Status', key: 'status', type: 'text' },
  ];

  ngOnInit(): void {
    this.getEvents();
  }

  private getEvents() {
    this.ticketsService.getAllTickets().subscribe({
      next: (res) => {
        const data = res.map((ticket) => ({
          ...ticket,
          status: ticket.status === 'VALID' ? "Válido" : "Inválido"
        }));
        
        this.allTickets.set(data);
        this.filteredTickets.set(data);
        this.totalItems.set(data.length);
      }
    });
  }

  public filter(search: string) {
    this.currentPage.set(1);
    this.searchTerm.set(search);

    const term = search.toLowerCase();

    const filtered = this.allTickets().filter(ticket =>
      ticket.userName.toLowerCase().includes(term) ||
      ticket.eventName.toLowerCase().includes(term) ||
      ticket.eventLocationName.toLowerCase().includes(term) ||
      ticket.value.toString().toLowerCase().includes(term) ||
      ticket.status.toLowerCase().includes(term)
    );

    this.filteredTickets.set(filtered);
    this.totalItems.set(filtered.length);
  }

  public getPaginatedTickets(): GetAllTickets[] {
    const start = (this.currentPage() - 1) * this.pageSize();
    const end = start + this.pageSize();
    return this.filteredTickets().slice(start, end);
  }

  handlePageChange(event: { page: number; size: number }) {
    this.currentPage.set(event.page);
    this.pageSize.set(event.size);
  }
    
  public gotoDetailPage(row: any) {
    this.router.navigate([row.id], { relativeTo: this.activatedRoute });
  }

  gotoEditPage(row: any) {
    this.router.navigate(['/admin/clients/edit', row.id]);
  }

  deleteEvent(row: any) {
    // implementar delete se quiser
  }

  toggleView(mode: ViewMode): void {
    this.viewMode = mode;
  }

  applyFilter(tipo: string) {
    console.log('Filtro selecionado:', tipo);
  }
}
