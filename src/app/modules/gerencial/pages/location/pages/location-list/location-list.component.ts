import { Component, computed, inject, signal } from '@angular/core';
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

  public userRole = signal<string | null>(null);
  public adminId = signal<number | null>(null);
  public allLocationsData = signal<LocationTableRow[]>([]);
  public locationsData = signal<LocationTableRow[]>([]);

  // paginação
  public totalItems = signal<number>(0);
  public currentPage = signal<number>(1); 
  public pageSize = signal<number>(10);   
  public searchTerm = signal<string | undefined>(undefined);

  public filteredLocationsData = computed(() => {
    const term = this.searchTerm()?.toLowerCase();
    if (!term) return this.allLocationsData();

    return this.allLocationsData().filter(loc => 
      loc.name.toLowerCase().includes(term) ||
      loc.description.toLowerCase().includes(term) ||
      loc.categories.some(catName => catName.toLowerCase().includes(term))
    );
  });

  public paginatedLocationsData = computed(() => {
    const start = (this.currentPage() - 1) * this.pageSize();
    const end = start + this.pageSize();
    return this.filteredLocationsData().slice(start, end);
  });

  public displayedColumns: TableColumn[] = [
    { label: 'Nome', key: 'name', type: 'text' },
    { label: 'Categorias', key: 'categories', type: 'text' },
    { label: 'Descrição', key: 'description', type: 'text' },
    { label: '', key: 'menu', type: 'menu' },
  ];

  ngOnInit() {
    this.getUserRole();
    this.loadLocations();
  }

  private loadLocations() {
    if(this.userRole() === 'ADMIN') {
      this.getLocations();
    } else {
      this.getLocationsByRepresentative();
    }
  }

  private getLocations() {
    this.locationService.getAllLocations().pipe(
      map((res): LocationTableRow[] => {
        return res.map(loc => ({
          id: loc.id,
          name: loc.name,
          description: loc.description,
          categories: loc.categories.map(cat => cat.name)
        }));
      })
    ).subscribe({
      next: (transformedLocations) => {
        this.allLocationsData.set(transformedLocations);
        this.totalItems.set(transformedLocations.length);
      }
    });
  }

  private getLocationsByRepresentative() {
    this.locationService.getLocationsByRepresentative(this.adminId()!).subscribe({
      next: (res) => {
        // Mapeia os dados do local do representante
        const locationData: LocationTableRow = {
          id: res.id,
          name: res.name,
          description: res.description,
          categories: [] // Não disponível no retorno atual, mas pode ser adicionado se necessário
        };
        
        this.allLocationsData.set([locationData]);
        this.totalItems.set(1);
      },
      error: (err) => {
        console.error("Erro ao buscar local do representante:", err);
        this.toastr.error('Erro ao carregar local');
      }
    });
  }

  public filter(search: string) {
    this.currentPage.set(1); // sempre volta pra primeira página
    this.searchTerm.set(search);
    this.totalItems.set(this.filteredLocationsData().length);
  }

  handlePageChange(event: {page: number, size: number}) {
    this.currentPage.set(event.page);
    this.pageSize.set(event.size);
    this.loadLocations();
  }

  public gotoDetailPage(row: any) {
    this.router.navigate([row.id], { relativeTo: this.activatedRoute });
  }

  gotoEditPage(row: any) {
    this.router.navigate(['gerencial/local/editar', row.id])
  }

  deleteLocation(row: any) {
    this.confirmDialog.confirm('Confirmar exclusão', 'Você tem certeza que deseja excluir este local?')
      .then((confirmed) => {
        if (confirmed) {
          this.locationService.deleteLocation(row.id).subscribe({
            next: () => {
              this.toastr.success('Local deletado com sucesso');
              this.loadLocations();
            },
            error: (err) => {
              console.error('Erro ao excluir local:', err);
              this.toastr.error('Erro ao excluir local');
            }
          });
        }
      });
  }

  getUserRole() {
    const role = localStorage.getItem('role');
    const adminId = localStorage.getItem('adminId');
    this.userRole.set(role);
    this.adminId.set(adminId ? Number(adminId) : null);
  }
}
