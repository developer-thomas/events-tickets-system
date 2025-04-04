import { Component, inject } from '@angular/core';
import { PageHeaderComponent } from '../../../../../shared/components/page-header/page-header.component';
import { FilterTableComponent } from '../../../../../shared/components/filter-table/filter-table.component';
import { CommomTableComponent, TableColumn } from '../../../../../shared/components/commom-table/commom-table.component';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { BaseButtonComponent } from '../../../../../shared/components/base-button/base-button.component';

@Component({
  selector: 'app-location-list',
  standalone: true,
  imports: [PageHeaderComponent, FilterTableComponent, CommomTableComponent, BaseButtonComponent],
  templateUrl: './location-list.component.html',
  styleUrl: './location-list.component.scss'
})
export class LocationListComponent {
  private router = inject(Router);
  private toastr = inject(ToastrService);
  private activatedRoute = inject(ActivatedRoute);

  public title = 'Local';
  public pageSession = 'Local';

  // AJUSTAR O ANY QUANDO ESTIVER NA FASE DE INTEGRAÇÃO
  public location: any= [];

  public displayedColumns: TableColumn[] = [
    { label: 'Nome', key: 'name', type: 'text' },
    { label: 'Categorias', key: 'categories', type: 'text' },
    { label: 'Telefone', key: 'description', type: 'text' },
    { label: 'Status', key: 'status', type: 'status' },
    { label: '', key: 'menu', type: 'menu' },
  ];

  ngOnInit() {
    this.getLocations();
  }

  private getLocations(search?: string) {
    let location = [];
    for (let i = 0; i <= 10; i++) {
      location.push({
        id: i,
        name: 'Nome',
        categories: 'Categoria',
        description: 'Descrição do Evento',
        status: 'Ativo'
      })
    }
    this.location = location;
  }

  public filter(search: string) {
    this.getLocations(search);
  }

  public gotoDetailPage(row: any) {
    this.router.navigate([row.id], { relativeTo: this.activatedRoute });
  }

  gotoEditPage(row: any) {
    this.router.navigate(['/admin/clients/edit', row.id])
  }

  deleteLocation(row: any) {
    const deleteUser = confirm('Deseja deletar esse usuário?');

    // DESCOMENTAR QUANDO ESTIVER NA FASE DE INTEGRAÇÃO
    // if (deleteUser) {
    //   this.clientService.deleteClient(row.id);
    //   this.toastr.success('Cliente excluído com sucesso!')
    // }
    return

  }
}
