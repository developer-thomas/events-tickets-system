import { Component, inject, OnInit, signal } from '@angular/core';
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
              [data]="financialData()"
              [displayedColumns]="displayedColumns"
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
  financialData = signal<GetUserFinancial[]>([]);

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
          this.financialData.set(data);
        }
      })
    }
  }
}
