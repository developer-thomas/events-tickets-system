import { Component, inject, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { CommomTableComponent, TableColumn } from '../../../../../shared/components/commom-table/commom-table.component';
import { PageHeaderComponent } from '../../../../../shared/components/page-header/page-header.component';
import { FilterTableComponent } from '../../../../../shared/components/filter-table/filter-table.component';
import { BaseButtonComponent } from '../../../../../shared/components/base-button/base-button.component';

@Component({
  selector: 'app-event-list',
  standalone: true,
  imports: [PageHeaderComponent, FilterTableComponent, BaseButtonComponent, CommomTableComponent],
  templateUrl: './event-list.component.html',
  styleUrl: './event-list.component.scss'
})
export class EventListComponent implements OnInit {
  private router = inject(Router);
  private toastr = inject(ToastrService);
  private activatedRoute = inject(ActivatedRoute);

  public title = 'Evento';
  public pageSession = 'Evento';

  // AJUSTAR O ANY QUANDO ESTIVER NA FASE DE INTEGRAÇÃO
  public eventData: any= [];

  public displayedColumns: TableColumn[] = [
    { label: 'Nome', key: 'name', type: 'text' },
    { label: 'Local', key: 'location', type: 'text' },
    { label: 'Quantidade', key: 'quantity', type: 'text' },
    { label: 'Valor', key: 'price', type: 'text' },
    { label: 'Período', key: 'period', type: 'text' },
    { label: 'Status', key: 'status', type: 'text' },
    { label: '', key: 'menu', type: 'menu' },
  ];

  ngOnInit() {
    this.getEvents();
  }

  private getEvents(search?: string) {
    let location = [];
    for (let i = 0; i <= 10; i++) {
      location.push({
        id: i,
        name: 'Nome',
        location: 'Local do Evento',
        quantity: '0000000',
        price: 'R$ 00,00',
        period: '00/00/00 - 00/00/00',
        status: 'Ativo'
      })
    }
    this.eventData = location;
  }

  public filter(search: string) {
    this.getEvents(search);
  }

  public gotoDetailPage(row: any) {
    this.router.navigate([row.id], { relativeTo: this.activatedRoute });
  }

  gotoEditPage(row: any) {
    this.router.navigate(['/admin/clients/edit', row.id])
  }

  deleteEvent(row: any) {
  }
}
