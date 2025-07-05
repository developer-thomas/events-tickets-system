import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatTabsModule } from '@angular/material/tabs';
import { CommomTableComponent, TableColumn } from '../../../../../../../shared/components/commom-table/commom-table.component';
import { GetUserFinancial } from '../../../../models/GetUserFinancial.interface';
import { ClientService } from '../../../../client.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-financial-tab',
  standalone: true,
  imports: [MatTabsModule, MatCardModule, CommomTableComponent],
  template:
  `
      <div class="p-2">
        <mat-card>
          <mat-card-content>
            <app-commom-table
              [data]="paginatedFinancialData()"
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
  ,
})
export class FinancialTabComponent implements OnInit {
  private clientService = inject(ClientService);
  private activatedRoute = inject(ActivatedRoute);

  private userId!: number;
  public allFinancialData = signal<GetUserFinancial[]>([]);
  public financialData = signal<GetUserFinancial[]>([]);

  // paginação
  public totalItems = signal<number>(0);
  public currentPage = signal<number>(1);
  public pageSize = signal<number>(10);
  public searchTerm = signal<string | undefined>(undefined);

  public filteredFinancialData = computed(() => {
    const term = this.searchTerm()?.toLowerCase();
    if (!term) return this.allFinancialData();

    return this.allFinancialData().filter(financial => 
      financial.codeId?.toString().includes(term) ||
      financial.method?.toLowerCase().includes(term) ||
      financial.status?.toLowerCase().includes(term)
    );
  });

  public paginatedFinancialData = computed(() => {
    const start = (this.currentPage() - 1) * this.pageSize();
    const end = start + this.pageSize();
    return this.filteredFinancialData().slice(start, end);
  });

  public displayedColumns: TableColumn[] = [
    { label: 'Data', key: 'createdAt', type: 'date' },
    { label: 'Código de transação', key: 'codeId', type: 'text' },
    { label: 'Método de Pagamento', key: 'method', type: 'text' },
    { label: 'Valor', key: 'amount', type: 'currency' },
    { label: 'Status', key: 'status', type: 'text' },
  ];

  ngOnInit(): void {
    this.getUserId();
    this.fetchData();  
  }

  getUserId() {
    const userId = this.activatedRoute.snapshot.params['id'];
    if(userId) {
      this.userId = userId;
    }
  }

  fetchData() {
    const userId = this.userId;

    if(userId) {
      this.clientService.getUserFinancial(userId).subscribe({
        next: (res) => {
          const data = res.map((payment) => ({
            ...payment, 
            status: payment.status === 'Paid' ? 'Pago' : 'Não pago',
            method: payment.method === 'CREDIT_CARD' ? 'Cartão de Crédito' : 'Pix',
          }))
          this.allFinancialData.set(data);
          this.totalItems.set(data.length);
        },
        error: (error) => {
          console.error('Erro ao carregar dados financeiros:', error);
        }
      })
    }
  }

  public filter(search: string) {
    this.currentPage.set(1); // sempre volta pra primeira página
    this.searchTerm.set(search);
    this.totalItems.set(this.filteredFinancialData().length);
  }

  // Manipular mudanças de página
  public handlePageChange(event: {page: number, size: number}) {
    this.currentPage.set(event.page);
    this.pageSize.set(event.size);
  }
}
