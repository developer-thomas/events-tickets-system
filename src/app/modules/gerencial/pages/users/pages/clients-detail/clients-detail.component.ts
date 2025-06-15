import { Component, inject, Input, OnInit } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatTabsModule } from '@angular/material/tabs';
import { ToastrService } from 'ngx-toastr';
import { LabelAndInfoComponent } from '../../../../../shared/components/label-and-info/label-and-info.component';
import { PageHeaderComponent } from '../../../../../shared/components/page-header/page-header.component';
import { BooleanStatusPipe } from '../../../../../shared/pipes/boolean-status/boolean-status.pipe';
import { ClientService } from '../../client.service';
import { FinancialTabComponent } from './tabs/financial-tab/financial-tab.component';
import { TicketsTabComponent } from './tabs/tickets-tab/tickets-tab.component';
import { NgxMaskPipe } from 'ngx-mask';
import { CommonModule } from '@angular/common';

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
    TicketsTabComponent,
    NgxMaskPipe,
    CommonModule
  ],
})
export class ClientsDetailComponent implements OnInit {
  @Input() id!: number;

  private clientService = inject(ClientService);
  private toastr = inject(ToastrService);

  public title = 'Clientes';
  public pageSession = 'Detalhes do cliente';
  
  public client?:  | any;

  ngOnInit(): void {
    this.getClient();
  }

  private getClient(): void {   
    this.clientService.getClientById(this.id).subscribe((client) => {
      this.client = client.result;
    });
  }

  public changeStatus(): void {
    this.clientService.changeStatus(this.id).subscribe(() => {
      this.toastr.success('Status alterado com sucesso');
      this.getClient();
    });
  }
 
}
