import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Router, ActivatedRoute } from '@angular/router';
import { CommomTableComponent, TableColumn } from '../../../../shared/components/commom-table/commom-table.component';
import { FilterTableComponent } from '../../../../shared/components/filter-table/filter-table.component';
import { PageHeaderComponent } from '../../../../shared/components/page-header/page-header.component';
import { DashboardViewComponent } from './dashboard-view/dashboard-view.component';
import { FinancialService } from '../financial.service';
import { GetAllFinancial } from '../models/GetAllFinancial.interface';

type ViewMode = "list" | "dashboard"

@Component({
  selector: 'app-financial-list',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatIconModule, PageHeaderComponent, DashboardViewComponent, CommomTableComponent],
  templateUrl: './financial-list.component.html',
  styleUrl: './financial-list.component.scss'
})
export class FinancialListComponent {
  private router = inject(Router);
  private activatedRoute = inject(ActivatedRoute);
  private financialService = inject(FinancialService);

  viewMode: ViewMode = "list"

  public financialData = signal<GetAllFinancial[]>([]);

  public displayedColumns: TableColumn[] = [
      { label: 'Data', key: 'createdAt', type: 'date' },
      { label: 'Usuário', key: 'user', type: 'text' },
      { label: 'Método de pagamento', key: 'payment', type: 'text' },
      { label: 'Valor', key: 'value', type: 'currency' },
      { label: 'Status', key: 'status', type: 'text' },
    ];

  ngOnInit(): void {
    this.getFinancial();
  }

  private getFinancial(search?: string) {
    this.financialService.getAll().subscribe({
      next: (res) => {
        console.log(res)
        const data = res.map((financial: GetAllFinancial) => ({
          ...financial,
          payment: financial.payment !== null ? this.translate(financial.payment.method) : 'N/A',
          user: financial.user.name,
          status: this.translate(financial.status)
          
        }))

        this.financialData.set(data);
      
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
    this.getFinancial(search);
  }

  translate(word: string) {
    if (word === 'CREDIT_CARD') return 'Cartão de Crédito';
    if (word === 'PIX') return 'Pix';
    if (word === 'Paid') return 'Pago';
    if (word === 'UnPaid') return 'Não pago';

    return word; 
  }
}
