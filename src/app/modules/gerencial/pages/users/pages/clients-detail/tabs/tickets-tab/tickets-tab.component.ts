import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { CommomTableComponent, TableColumn } from '../../../../../../../shared/components/commom-table/commom-table.component';
import { ClientService } from '../../../../client.service';
import { ActivatedRoute } from '@angular/router';
import { GetUserTicket } from '../../../../models/GetUserTickets.interface';


@Component({
  selector: 'app-tickets-tab',
  standalone: true,
  imports: [MatCardModule, CommomTableComponent],
  template: `
      <div class="p-2">
        <mat-card>
          <mat-card-content>
            <app-commom-table
              [data]="ticketsData()"
              [displayedColumns]="displayedColumns"
            ></app-commom-table>
          </mat-card-content>
        </mat-card>
      </div>
   `
})
export class TicketsTabComponent implements OnInit {
  private clientService = inject(ClientService);
  private activatedRoute = inject(ActivatedRoute);
  
  private userId!: any;
  ticketsData = signal<GetUserTicket[]>([]);

  public displayedColumns: TableColumn[] = [
    { label: 'Comprado em', key: 'createdAt', type: 'date' },
    { label: 'Local', key: 'locationName', type: 'text' },
    { label: 'Evento', key: 'eventName', type: 'text' },
    { label: 'Valor', key: 'value', type: 'text' },
    { label: 'Status', key: 'status', type: 'text' },
  ];

  ngOnInit(): void {
    const userId = this.activatedRoute.snapshot.params['id'];

    if(userId) {
      this.userId = userId;
      this.fetchData()
    }
  }

  fetchData() {
    this.clientService.getUserTickets(this.userId).subscribe({
      next: (tickets) => {
        const transformedData:any = tickets.map((ticket) => ({
          ...ticket,
          locationName: ticket.event.eventLocation.name ?? '',
          eventName: ticket.event.name,
          createdAt: ticket.createdAt,
          status: ticket.status === 'USED' ? 'Usado' : 'Válido'

        }))

        this.ticketsData.set(transformedData);
      }
    })
  }
}
