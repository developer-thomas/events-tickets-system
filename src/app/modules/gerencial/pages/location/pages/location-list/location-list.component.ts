import { Component, inject, signal } from '@angular/core';
import { PageHeaderComponent } from '../../../../../shared/components/page-header/page-header.component';
import { FilterTableComponent } from '../../../../../shared/components/filter-table/filter-table.component';
import { CommomTableComponent, TableColumn } from '../../../../../shared/components/commom-table/commom-table.component';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { BaseButtonComponent } from '../../../../../shared/components/base-button/base-button.component';
import { LocationTableRow } from '../../models/GetAllLocations.interface';
import { LocationService } from '../../location.service';
import { map } from 'rxjs';
import { ConfirmDialogService } from '../../../../../shared/services/confirm-dialog/confirmDialog.service';

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
  private confirmDialog = inject(ConfirmDialogService);

  public title = 'Local';
  public pageSession = 'Local';

  public allLocationsData = signal<LocationTableRow[]>([]);
public locationsData = signal<LocationTableRow[]>([]);

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

  private getLocations() {
    this.locationService.getAllLocations().pipe(
      map((res): LocationTableRow[] => {
        return res.result.map(loc => ({
          id: loc.id,
          name: loc.name,
          description: loc.description,
          categories: loc.categories.map(cat => cat.name)
        }));
      })
    ).subscribe({
      next: (transformedLocations) => {
        this.allLocationsData.set(transformedLocations);
        this.locationsData.set(transformedLocations);
        this.totalItems.set(transformedLocations.length);
      }
    });
  }

  public filter(search: string) {
    const lowerSearch = search.toLowerCase();
    const filtered = this.allLocationsData().filter(loc => 
      loc.name.toLowerCase().includes(lowerSearch) ||
      loc.description.toLowerCase().includes(lowerSearch) ||
      loc.categories.some(catName => catName.toLowerCase().includes(lowerSearch))
    );
    this.locationsData.set(filtered);
    this.totalItems.set(filtered.length);
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
    this.confirmDialog.confirm('Confirmar exclusão', 'Você tem certeza que deseja excluir este local?')
      .then((confirmed) => {
        if (confirmed) {
          this.locationService.deleteLocation(row.id).subscribe({
            next: () => {
              this.toastr.success('Local deletado com sucesso');
              this.getLocations();
            },
            error: (err) => {
              console.error('Erro ao excluir evento:', err);
              this.toastr.error('Erro ao excluir local');
            }
          });
        }
      });
  }
}
