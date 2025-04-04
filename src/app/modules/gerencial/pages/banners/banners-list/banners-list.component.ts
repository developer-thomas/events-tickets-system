import { Component, inject } from '@angular/core';
import { CommomTableComponent, TableColumn } from '../../../../shared/components/commom-table/commom-table.component';
import { PageHeaderComponent } from '../../../../shared/components/page-header/page-header.component';
import { FilterTableComponent } from '../../../../shared/components/filter-table/filter-table.component';
import { BaseButtonComponent } from '../../../../shared/components/base-button/base-button.component';
import { Router, ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-banners-list',
  standalone: true,
  imports: [CommomTableComponent, PageHeaderComponent, FilterTableComponent, BaseButtonComponent],
  templateUrl: './banners-list.component.html',
  styleUrl: './banners-list.component.scss'
})
export class BannersListComponent {
  private router = inject(Router);
  private toastr = inject(ToastrService);
  private activatedRoute = inject(ActivatedRoute);

  public title = 'Banners';
  public pageSession = 'Banners';

  // AJUSTAR O ANY QUANDO ESTIVER NA FASE DE INTEGRAÇÃO
  public bannersData: any= [];

  public displayedColumns: TableColumn[] = [
    { label: 'Data Inicial', key: 'initialDate', type: 'text' },
    { label: 'Data Final', key: 'endDate', type: 'text' },
    { label: 'Nome', key: 'name', type: 'text' },
    { label: 'Status', key: 'status', type: 'status' },
    { label: '', key: 'menu', type: 'menu' },
  ];

  ngOnInit() {
    this.getBanners();
  }

  private getBanners(search?: string) {
    let location = [];
    for (let i = 0; i <= 10; i++) {
      location.push({
        id: i,
        initialDate: '00/00/00',
        endDate: '00/00/00',
        name: 'Nome do Banner',
        status: 'Ativo'
      })
    }
    this.bannersData = location;
  }

  public filter(search: string) {
    this.getBanners(search);
  }

  public gotoDetailPage(row: any) {
    this.router.navigate([row.id], { relativeTo: this.activatedRoute });
  }

  gotoEditPage(row: any) {
    this.router.navigate(['/admin/clients/edit', row.id])
  }

  deleteBanner(row: any) {
    return

  }
}
