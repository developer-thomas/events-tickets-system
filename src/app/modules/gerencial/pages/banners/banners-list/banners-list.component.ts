import { Component, inject, signal } from '@angular/core';
import { CommomTableComponent, TableColumn } from '../../../../shared/components/commom-table/commom-table.component';
import { PageHeaderComponent } from '../../../../shared/components/page-header/page-header.component';
import { FilterTableComponent } from '../../../../shared/components/filter-table/filter-table.component';
import { BaseButtonComponent } from '../../../../shared/components/base-button/base-button.component';
import { Router, ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { BannersService } from '../banners.service';
import { GetAllBanners } from '../models/GetAllBanners.interface';
import { ConfirmDialogService } from '../../../../shared/services/confirm-dialog/confirmDialog.service';

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
  private bannersService = inject(BannersService);
  private confirmDialog = inject(ConfirmDialogService);

  public title = 'Banners';
  public pageSession = 'Banners';

  // AJUSTAR O ANY QUANDO ESTIVER NA FASE DE INTEGRAÇÃO
  public bannersData = signal<GetAllBanners[]>([]);

  // paginação
  public totalItems = signal<number>(0);
  public currentPage = signal<number>(0);
  public pageSize = signal<number>(0);
  public searchTerm = signal<string | undefined>(undefined);
  
  public displayedColumns: TableColumn[] = [
    { label: 'Data Inicial', key: 'dateInit', type: 'text' },
    { label: 'Data Final', key: 'dateFinish', type: 'text' },
    { label: 'Nome', key: 'title', type: 'text' },
    { label: 'Status', key: 'status', type: 'status' },
    { label: '', key: 'menu', type: 'menu' },
  ];

  ngOnInit() {
    this.getBanners();
  }

  private getBanners(search?: string) {
    this.bannersService.getAll(this.currentPage(), this.pageSize(), this.searchTerm()).subscribe({
      next: (res) => {
        const mappedBanners = res.map((banner) => ({
          ...banner,
          dateInit: new Date(banner.dateInit).toLocaleDateString("pt-BR"),
          dateFinish: new Date(banner.dateFinish).toLocaleDateString("pt-BR"),
          status: banner.status ? "Ativo" : "Inativo",
        }))

        this.bannersData.set(mappedBanners);
        this.totalItems.set(res.length); // Temporário, ajuste conforme o back
      }, error: (err) => {
        console.error("Erro ao buscar banners", err)
      }
    })
  }

  public filter(search: string) {
    this.getBanners(search);
  }

  handlePageChange(event: {page: number, size: number}) {
    this.currentPage.set(event.page);
    this.pageSize.set(event.size);
    this.getBanners();
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
