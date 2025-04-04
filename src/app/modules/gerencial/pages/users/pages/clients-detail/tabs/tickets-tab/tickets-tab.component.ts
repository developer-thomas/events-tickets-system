import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { CommomTableComponent, TableColumn } from '../../../../../../../shared/components/commom-table/commom-table.component';

@Component({
  selector: 'app-tickets-tab',
  standalone: true,
  imports: [MatCardModule, CommomTableComponent],
  template: `
      <div class="p-2">
        <mat-card>
          <mat-card-content>
            <app-commom-table
              [data]="ticketsData"
              [displayedColumns]="displayedColumns"
            ></app-commom-table>
          </mat-card-content>
        </mat-card>
      </div>
   `
})
export class TicketsTabComponent implements OnInit {
  ticketsData!: any;
  
  public displayedColumns: TableColumn[] = [
    { label: 'Data', key: 'data', type: 'text' },
    { label: 'Usuário', key: 'user', type: 'text' },
    { label: 'Local', key: 'location', type: 'text' },
    { label: 'Evento', key: 'event', type: 'text' },
    { label: 'Valor', key: 'price', type: 'text' },
    { label: 'Status', key: 'status', type: 'text' },
    { label: '', key: 'menu', type: 'menu' },
  ];

  ngOnInit(): void {
    this.fetchData()
  }

  fetchData() {
    let tickets = [];
    for (let i = 0; i <= 5; i++) {
      tickets.push(
        {
          data: '00/00/0000',
          user: 'Nome do usuário',
          location: 'Nome do Local',
          event: 'Nome do Evento',
          price: 'R$: 00,00',
          status: 'Em aberto',
        },
      )
      this.ticketsData = tickets 
    }
  }
}
