import { Component, inject, Input, OnInit } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatTabsModule } from '@angular/material/tabs';
import { ToastrService } from 'ngx-toastr';
import { CommomTableComponent, TableColumn } from '../../../../../shared/components/commom-table/commom-table.component';
import { LabelAndInfoComponent } from '../../../../../shared/components/label-and-info/label-and-info.component';
import { PageHeaderComponent } from '../../../../../shared/components/page-header/page-header.component';
import { BooleanStatusPipe } from '../../../../../shared/pipes/boolean-status/boolean-status.pipe';
import { ClientResponse, ClientService } from '../../client.service';
import { FinancialTabComponent } from './tabs/financial-tab/financial-tab.component';
import { TicketsTabComponent } from './tabs/tickets-tab/tickets-tab.component';

@Component({
  selector: 'app-clients-detail',
  standalone: true,
  templateUrl: './clients-detail.component.html',
  styleUrl: './clients-detail.component.scss',
  imports: [
    MatCardModule,
    MatSlideToggleModule,
    MatTabsModule,
    LabelAndInfoComponent,
    PageHeaderComponent,
    BooleanStatusPipe,
    FinancialTabComponent,
    TicketsTabComponent
  ],
})
export class ClientsDetailComponent implements OnInit {
  @Input() id!: string;

  private clientService = inject(ClientService);
  private toastr = inject(ToastrService);

  public title = 'Clientes';
  public pageSession = 'Detalhes do cliente';
  
  // RETIRAR O ANY NA FASE DE INTEGRAÇÃO
  public client?: ClientResponse | any;

  // PARA OS DADOS MOCKADOS (AJUSTAR NA INTEGRAÇÃO)
  public financial!: any;
  public tickets!: any;

  ngOnInit(): void {
    this.getClient();
  }

  private getClient(): void {
    this.client = {
      avatar: '../../../../../../../assets/images/client-photo.jpeg',
      name: 'Ricardo Gonçalves',
      age: '28 Anos',
      status: 'Ativo',
      email: 'mail@email.com',
      phone: '(00) 00000-0000'
    }
    
    // DESCOMENTAR NA FASE DE INTEGRAÇÃO
    // this.clientService.getClientById(this.id).subscribe((client) => {
    //   this.client = client;
    // });
  }

  public changeStatus(): void {
    this.clientService.changeStatus(this.id).subscribe(() => {
      this.toastr.success('Status alterado com sucesso');
      this.getClient();
    });
  }
 
}
