import { CommonModule } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
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
  imports: [
    CommonModule, 
    MatButtonModule, 
    MatIconModule, 
    PageHeaderComponent, 
    DashboardViewComponent, 
    CommomTableComponent,
    FilterTableComponent
  ],
  templateUrl: './financial-list.component.html',
  styleUrl: './financial-list.component.scss'
})
export class FinancialListComponent {
  private router = inject(Router);
  private activatedRoute = inject(ActivatedRoute);
  private financialService = inject(FinancialService);

  viewMode: ViewMode = "list";

  public searchTerm = signal<string | undefined>(undefined);

  public allFinancialData = signal<GetAllFinancial[]>([]);
  public filteredFinancialData = signal<GetAllFinancial[]>([]);

  // Paginação
  public totalItems = signal<number>(0);
  public currentPage = signal<number>(1);
  public pageSize = signal<number>(10);

  public displayedColumns: TableColumn[] = [
    { label: 'Data', key: 'createdAt', type: 'date' },
    { label: 'Usuário', key: 'user', type: 'text' },
    { label: 'Método de pagamento', key: 'payment', type: 'text' },
    { label: 'Valor', key: 'value', type: 'currency' },
    { label: 'Status', key: 'status', type: 'text' },
    { label: 'Transação', key: 'transactionId', type: 'text' },
  ];

  ngOnInit(): void {
    this.getFinancial();
  }

  private getFinancial() {
    this.financialService.getAll().subscribe({
      next: (res) => {
        const data = res.data.map((financial: any) => ({
          createdAt: financial.date,
          user: financial.username,
          payment: financial.method ? this.translate(financial.method) : 'N/A',
          value: financial.value ?? 0,
          status: financial.status ? this.translate(financial.status) : 'N/A',
          transactionId: financial.transactionId ?? 'N/A',
        }));

        this.allFinancialData.set(data);
        this.filteredFinancialData.set(data);
        this.totalItems.set(res.data.length); // ou use res.metadata.totalPages*pageSize
      }
    });
  }

  public filter(search: string) {
    this.currentPage.set(1);
    this.searchTerm.set(search);

    const term = search.toLowerCase();

    const filtered = this.allFinancialData().filter(item =>
      (typeof item.user === 'string' ? item.user : (item.user?.name ?? '')).toLowerCase().includes(term) ||
      (typeof item.payment === 'string' ? item.payment : (item.payment?.method ?? '')).toLowerCase().includes(term) ||
      (item.status ?? '').toLowerCase().includes(term) ||
      (item.value ?? '').toString().includes(term) ||
      new Date(item.createdAt).toLocaleDateString("pt-BR").includes(term)
    );

    this.filteredFinancialData.set(filtered);
    this.totalItems.set(filtered.length);
  }

  public getPaginatedData(): GetAllFinancial[] {
    const start = (this.currentPage() - 1) * this.pageSize();
    const end = start + this.pageSize();
    return this.filteredFinancialData().slice(start, end);
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
    // Implemente a exclusão se quiser
  }

  toggleView(mode: ViewMode): void {
    this.viewMode = mode;
  }

  translate(word: string) {
    if (word === 'CREDIT_CARD') return 'Cartão de Crédito';
    if (word === 'PIX') return 'Pix';
    if (word === 'Paid') return 'Pago';
    if (word === 'UnPaid') return 'Não pago';

    return word; 
  }
}
