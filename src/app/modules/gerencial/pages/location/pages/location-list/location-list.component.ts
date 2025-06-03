import { Component, inject, signal } from '@angular/core';
import { PageHeaderComponent } from '../../../../../shared/components/page-header/page-header.component';
import { FilterTableComponent } from '../../../../../shared/components/filter-table/filter-table.component';
import { CommomTableComponent, TableColumn } from '../../../../../shared/components/commom-table/commom-table.component';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { BaseButtonComponent } from '../../../../../shared/components/base-button/base-button.component';
import { AllLocations, GetAllLocations } from '../../models/GetAllLocations.interface';
import { LocationService } from '../../location.service';
import { map } from 'rxjs';

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
  private locationService = inject(LocationService);

  public title = 'Local';
  public pageSession = 'Local';

  public locationsData = signal<AllLocations[]>([]);

  // paginação
  public totalItems = signal<number>(0);
  public currentPage = signal<number>(0);
  public pageSize = signal<number>(0);
  public searchTerm = signal<string | undefined>(undefined);

  public displayedColumns: TableColumn[] = [
    { label: 'Nome', key: 'name', type: 'text' },
    { label: 'Categorias', key: 'categories', type: 'text' },
    { label: 'Descrição', key: 'description', type: 'text' },
    { label: '', key: 'menu', type: 'menu' },
  ];

  ngOnInit() {
    this.getLocations();
  }

  private getLocations(search?: string) {
    this.locationService.getAllLocations(this.currentPage(), this.pageSize(), this.searchTerm()).pipe(
      map((res): any[] => {
        console.log('res', res)
        return res.result.map(loc => ({
          id: loc.id,
          name: loc.name,
          description: loc.description,
          categories: loc.categories.map(cat => cat.name)
        }));
      })
    ).subscribe({
      next: (transformedLocation) => {
        this.locationsData.set(transformedLocation); 
      }
    });
  }

  public filter(search: string) {
    this.getLocations(search);
  }

  handlePageChange(event: {page: number, size: number}) {
    this.currentPage.set(event.page);
    this.pageSize.set(event.size);
    this.getLocations();
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
