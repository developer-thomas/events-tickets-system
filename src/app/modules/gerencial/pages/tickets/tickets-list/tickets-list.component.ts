import { Component, inject, OnInit } from '@angular/core';
import { DashboardViewComponent } from './dashboard-view/dashboard-view.component';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { PageHeaderComponent } from '../../../../shared/components/page-header/page-header.component';
import { FilterTableComponent } from '../../../../shared/components/filter-table/filter-table.component';
import { CommomTableComponent, TableColumn } from '../../../../shared/components/commom-table/commom-table.component';
import { Router, ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

type ViewMode = "list" | "dashboard"

@Component({
  selector: 'app-tickets-list',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatIconModule, PageHeaderComponent, DashboardViewComponent, FilterTableComponent, CommomTableComponent],
  templateUrl: './tickets-list.component.html',
  styleUrl: './tickets-list.component.scss'
})
export class TicketsListComponent implements OnInit{
  private router = inject(Router);
  private toastr = inject(ToastrService);
  private activatedRoute = inject(ActivatedRoute);

  viewMode: ViewMode = "list"
  public eventData: any= [];

  public displayedColumns: TableColumn[] = [
      { label: 'Data', key: 'date', type: 'text' },
      { label: 'Usuário', key: 'user', type: 'text' },
      { label: 'Local', key: 'location', type: 'text' },
      { label: 'Evento', key: 'event', type: 'text' },
      { label: 'Valor', key: 'price', type: 'text' },
      { label: 'Status', key: 'status', type: 'text' },
      { label: '', key: 'menu', type: 'menu' },
    ];

  ngOnInit(): void {
    this.getEvents();
  }

  private getEvents(search?: string) {
    let location = [];
    for (let i = 0; i <= 10; i++) {
      location.push({
        id: i,
        date: '00/00/00',
        user: 'Nome',
        location: 'Nome do Local',
        event: 'Nome do Evento',
        price: 'R$ 00,00',
        status: 'Ativo'
      })
    }
    this.eventData = location;
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

}
