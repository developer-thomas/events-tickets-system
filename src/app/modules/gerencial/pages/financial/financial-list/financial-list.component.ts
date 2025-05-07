import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Router, ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { CommomTableComponent, TableColumn } from '../../../../shared/components/commom-table/commom-table.component';
import { FilterTableComponent } from '../../../../shared/components/filter-table/filter-table.component';
import { PageHeaderComponent } from '../../../../shared/components/page-header/page-header.component';
import { DashboardViewComponent } from './dashboard-view/dashboard-view.component';

type ViewMode = "list" | "dashboard"

@Component({
  selector: 'app-financial-list',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatIconModule, PageHeaderComponent, DashboardViewComponent, FilterTableComponent, CommomTableComponent],
  templateUrl: './financial-list.component.html',
  styleUrl: './financial-list.component.scss'
})
export class FinancialListComponent {
 private router = inject(Router);
  private toastr = inject(ToastrService);
  private activatedRoute = inject(ActivatedRoute);

  viewMode: ViewMode = "list"
  public financialData: any= [];

  public displayedColumns: TableColumn[] = [
      { label: 'Nome do Evento', key: 'name', type: 'text' },
      { label: 'Local', key: 'location', type: 'text' },
      { label: 'Data', key: 'date', type: 'text' },
      { label: 'Ingressos vendidos', key: 'ticketsSold', type: 'text' },
      { label: 'Valor unitário', key: 'unitPrice', type: 'text' },
      { label: 'Valor total', key: 'totalValue', type: 'text' },
      { label: 'Ingressos VIPs', key: 'vipTickets', type: 'text' },
      { label: '', key: 'menu', type: 'menu' },
    ];

  ngOnInit(): void {
    this.getFinancial();
  }

  private getFinancial(search?: string) {
    let financial = [];
    for (let i = 0; i <= 10; i++) {
      financial.push({
        id: i,
        name: 'Nome do evento',
        location: 'Nome do Local',
        date: '00/00/00',
        ticketsSold: '00',
        unitPrice: 'R$ 00,00',
        totalValue: 'R$ 00,00',
        vipTickets: '00'
      })
    }
    this.financialData = financial;
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
    this.getFinancial(search);
  }
}
