import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatTabsModule } from '@angular/material/tabs';
import { CommomTableComponent, TableColumn } from '../../../../../../../shared/components/commom-table/commom-table.component';

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
              [data]="financialData"
              [displayedColumns]="displayedColumns"
            ></app-commom-table>
          </mat-card-content>
        </mat-card>
      </div>
   `
  ,
})
export class FinancialTabComponent implements OnInit {
  financialData: any;

  public displayedColumns: TableColumn[] = [
    { label: 'Data', key: 'data', type: 'text' },
    { label: 'Usuário', key: 'user', type: 'text' },
    { label: 'Método de Pagamento', key: 'paymentMethod', type: 'text' },
    { label: 'Valor', key: 'price', type: 'text' },
    { label: 'Status', key: 'status', type: 'text' },
    { label: '', key: 'menu', type: 'menu' },
  ];

  ngOnInit(): void {
    this.fetchData();  
  }

  fetchData() {
    let financial = []

    for (let i = 0; i <= 5; i++) { 
      financial.push(
        {
          data: '00/00/0000',
          user: 'Nome do usuário',
          paymentMethod: 'Cartão de Crédito',
          price: 'R$ 00,00',
          status: 'Pago',
        },
      )
    }
    this.financialData = financial;
  }
}
