import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommomTableComponent, TableColumn } from '../../../../../shared/components/commom-table/commom-table.component';
import { FilterTableComponent } from '../../../../../shared/components/filter-table/filter-table.component';
import { PageHeaderComponent } from '../../../../../shared/components/page-header/page-header.component';
import { ClientService } from '../../client.service';
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

  public allClients = signal<any[]>([]);
  
  public paginatedClients = computed(() => {
    const start = (this.currentPage() - 1) * this.pageSize();
    const end = start + this.pageSize();
    return this.filteredClients().slice(start, end);
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
    this.clientService.getClients(this.currentPage(), this.pageSize()).subscribe((response) => {
      this.allClients.set(response);
      this.totalItems.set(response.length);
    });
  }

  public filter(search: string) {
    this.currentPage.set(1); // voltar para primeira página
    this.searchTerm.set(search); // atualiza a search term
    this.totalItems.set(this.filteredClients().length); // para paginar corretamente
  }
  

  // Manipular mudanças de página
  public handlePageChange(event: {page: number, size: number}) {
    this.currentPage.set(event.page);
    this.pageSize.set(event.size);
    this.getClients();
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

  public filteredClients = computed(() => {
    const search = this.searchTerm()?.toLowerCase();
  
    if (!search) return this.allClients();
  
    return this.allClients().filter((client) => {
      return (
        client.name?.toLowerCase().includes(search) ||
        client.email?.toLowerCase().includes(search) ||
        client.phone?.toLowerCase().includes(search)
      );
    });
  });

}
