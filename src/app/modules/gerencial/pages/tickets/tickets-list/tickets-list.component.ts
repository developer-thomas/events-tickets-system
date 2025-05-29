import { Component, inject, OnInit, signal } from '@angular/core';
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

type ViewMode = "list" | "dashboard"

@Component({
  selector: 'app-tickets-list',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatIconModule, PageHeaderComponent, DashboardViewComponent, CommomTableComponent, MatMenuModule, MatButtonModule, MatIconModule],
  templateUrl: './tickets-list.component.html',
  styleUrl: './tickets-list.component.scss'
})
export class TicketsListComponent implements OnInit{
  private router = inject(Router);
  private toastr = inject(ToastrService);
  private activatedRoute = inject(ActivatedRoute);
  private ticketsService = inject(TicketsService);

  viewMode: ViewMode = "list"

  public eventData = signal<GetAllTickets[]>([]);

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

  private getEvents(search?: string) {
    this.ticketsService.getAllTickets().subscribe({
      next: (res) => {
        const data = res.map((ticket) => ({
          ...ticket,
          status: ticket.status === 'VALID' ? "Válido" : "Inválido"
        }))
        
        this.eventData.set(data);
      }
    })
  }

  public gotoDetailPage(row: any) {
    this.router.navigate([row.id], { relativeTo: this.activatedRoute });
  }

  gotoEditPage(row: any) {
    this.router.navigate(['/admin/clients/edit', row.id])
  }

  deleteEvent(row: any) {
  }

  toggleView(mode: ViewMode): void {
    this.viewMode = mode
  }

  public filter(search: string) {
    this.getEvents(search);
  }

  // Aqui trata o filtro de acordo com o tipo
  applyFilter(tipo: string) {
    console.log('Filtro selecionado:', tipo);
  }
}
