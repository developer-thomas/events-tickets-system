import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PageHeaderComponent } from '../../../../shared/components/page-header/page-header.component';
import { CommomTableComponent, TableColumn } from '../../../../shared/components/commom-table/commom-table.component';
import { Router, ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { TicketsService } from '../tickets.service';
import { GetAllTickets } from '../../../../../core/models/tickets/GetAllTickets.interface';
import { FilterTableComponent } from '../../../../shared/components/filter-table/filter-table.component';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-tickets-list',
  standalone: true,
  imports: [
    CommonModule, 
    MatIconModule, 
    PageHeaderComponent, 
    CommomTableComponent, 
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

  public searchTerm = signal<string | undefined>(undefined);

  /** Dados da página atual (vindos do servidor) */
  public filteredTickets = signal<GetAllTickets[]>([]);

  // paginação (tratada no servidor)
  public totalItems = signal<number>(0);
  public currentPage = signal<number>(1);
  public pageSize = signal<number>(10);
  public loading = signal<boolean>(false);

  public displayedColumns: TableColumn[] = [
    { label: 'ID', key: 'id', type: 'text' },
    { label: 'Usuário', key: 'userName', type: 'text' },
    { label: 'Nome do evento', key: 'eventName', type: 'text' },
    { label: 'Nome do local', key: 'eventLocationName', type: 'text' },
    { label: 'Valor', key: 'value', type: 'text' },
    { label: 'Status', key: 'status', type: 'text' },
    { label: '', key: 'menu', type: 'menu' },
  ];

  ngOnInit(): void {
    this.getEvents();
  }

  private getEvents() {
    this.loading.set(true);
    this.ticketsService.getAllTickets({
      page: this.currentPage(),
      size: this.pageSize(),
      search: this.searchTerm()
    }).subscribe({
      next: (res) => {
        this.filteredTickets.set(res.data ?? []);
        this.totalItems.set(res.totalItems ?? 0);
        this.loading.set(false);
      },
      error: () => this.loading.set(false)
    });
  }

  public filter(search: string) {
    this.searchTerm.set(search);
    this.currentPage.set(1);
    this.getEvents();
  }

  handlePageChange(event: { page: number; size: number }) {
    this.currentPage.set(event.page);
    this.pageSize.set(event.size);
    this.getEvents();
  }
    
  public gotoDetailPage(row: any) {
    this.router.navigate([row.id], { relativeTo: this.activatedRoute });
  }

  gotoEditPage(row: any) {
    this.router.navigate(['/admin/clients/edit', row.id]);
  }
}
