import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommomTableComponent, TableColumn } from '../../../../../shared/components/commom-table/commom-table.component';
import { FilterTableComponent } from '../../../../../shared/components/filter-table/filter-table.component';
import { PageHeaderComponent } from '../../../../../shared/components/page-header/page-header.component';
import { ClientService } from '../../client.service';
import { ToastrService } from 'ngx-toastr';
import { GetAllClients } from '../../models/GetAllClients.interface';

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

  public allClientsData = signal<GetAllClients[]>([]);
  public clientsData = signal<GetAllClients[]>([]);

  public filteredClientsData = computed(() => {
    const term = this.searchTerm()?.toLowerCase();
    if (!term) return this.allClientsData();

    return this.allClientsData().filter(client => 
      client.name?.toLowerCase().includes(term) ||
      client.email?.toLowerCase().includes(term) ||
      client.phone?.toLowerCase().includes(term)
    );
  });

  public paginatedClientsData = computed(() => {
    const start = (this.currentPage() - 1) * this.pageSize();
    const end = start + this.pageSize();
    return this.filteredClientsData().slice(start, end);
  });

  // paginação
  public totalItems = signal<number>(0);
  public currentPage = signal<number>(1);
  public pageSize = signal<number>(10);
  public searchTerm = signal<string | undefined>(undefined);
  
  public displayedColumns: TableColumn[] = [
    { label: 'Nome', key: 'name', type: 'text' },
    { label: 'Telefone', key: 'phone', type: 'text' },
    { label: 'E-mail', key: 'email', type: 'text' },
    { label: 'Status', key: 'active', type: 'status' },
    { label: '', key: 'menu', type: 'menu' },
  ];

  ngOnInit() {
    this.getClients();
  }

  private getClients() {
    this.clientService.getClients().subscribe({
      next: (response) => {
        this.allClientsData.set(response);
        this.totalItems.set(response.length);
      },
      error: (error) => {
        console.error('Erro ao carregar clientes:', error);
        this.toastr.error('Erro ao carregar clientes');
      }
    });
  }

  public filter(search: string) {
    this.currentPage.set(1); // sempre volta pra primeira página
    this.searchTerm.set(search);
    this.totalItems.set(this.filteredClientsData().length);
  }

  // Manipular mudanças de página
  public handlePageChange(event: {page: number, size: number}) {
    this.currentPage.set(event.page);
    this.pageSize.set(event.size);
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
