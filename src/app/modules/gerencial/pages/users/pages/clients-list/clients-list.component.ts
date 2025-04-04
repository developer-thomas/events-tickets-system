import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommomTableComponent, TableColumn } from '../../../../../shared/components/commom-table/commom-table.component';
import { FilterTableComponent } from '../../../../../shared/components/filter-table/filter-table.component';
import { PageHeaderComponent } from '../../../../../shared/components/page-header/page-header.component';
import { ClientResponse, ClientService } from '../../client.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-clients-list',
  standalone: true,
  templateUrl: './clients-list.component.html',
  styleUrl: './clients-list.component.scss',
  imports: [
    FilterTableComponent,
    CommomTableComponent,
    PageHeaderComponent
  ],
})
export class ClientsListComponent implements OnInit {
  private router = inject(Router);
  private activatedRoute = inject(ActivatedRoute);
  private clientService = inject(ClientService);
  private toastr = inject(ToastrService);
  public title = 'Clientes';
  public pageSession = 'Clientes';

  // TIRAR O ANY QUANDO ESTIVER NA FASE DE INTEGRAÇÃO
  public clients: ClientResponse[] | any= [];

  public displayedColumns: TableColumn[] = [
    { label: 'Nome', key: 'name', type: 'text' },
    { label: 'CPF/CNPJ', key: 'document', type: 'text' },
    { label: 'Telefone', key: 'phone', type: 'text' },
    { label: 'E-mail', key: 'email', type: 'text' },
    { label: 'Status', key: 'status', type: 'status' },
    { label: '', key: 'menu', type: 'menu' },
  ];

  ngOnInit() {
    this.getClients();
  }

  private getClients(search?: string) {
    let users = [];
    for (let i = 0; i <= 10; i++) {
      users.push({
        id: i,
        name: 'Nome',
        document: '012.345.678-90',
        phone: '(00)00000-0000',
        email: 'mail@mail.com',
        status: 'Ativo'
      })
    }
    this.clients = users;

    // DESCOMENTAR QUANDO ESTIVER NA FASE DE INTEGRAÇÃO
    // this.clientService.getClients(1, 10, search).subscribe((response) => {
    //   console.log(response);
      
    //   this.clients = response.data;
    // });
  }

  public filter(search: string) {
    this.getClients(search);
  }

  public gotoDetailPage(row: any) {
    this.router.navigate([row.id], { relativeTo: this.activatedRoute });
  }

  gotoEditPage(row: any) {
    this.router.navigate(['/admin/clients/edit', row.id])
  }

  deleteClient(row: any) {
    const deleteUser = confirm('Deseja deletar esse usuário?');
    if (deleteUser) {
      this.clientService.deleteClient(row.id);
      this.toastr.success('Cliente excluído com sucesso!')
    }

    return

  }
}
