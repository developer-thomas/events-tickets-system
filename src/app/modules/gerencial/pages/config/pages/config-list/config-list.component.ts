import { Component, computed, effect, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { BaseButtonComponent } from '../../../../../shared/components/base-button/base-button.component';
import { CommomTableComponent, TableColumn } from '../../../../../shared/components/commom-table/commom-table.component';
import { FilterTableComponent } from '../../../../../shared/components/filter-table/filter-table.component';
import { PageHeaderComponent } from '../../../../../shared/components/page-header/page-header.component';
import { ConfigService } from '../../config.service';
import { GetAllCollaborators } from '../../models/GetAllCollaborators.interface';
import { ConfirmDialogService } from '../../../../../shared/services/confirm-dialog/confirmDialog.service';

@Component({
  selector: 'app-config-list',
  standalone: true,
  templateUrl: './config-list.component.html',
  styleUrl: './config-list.component.scss',
  imports: [
    FilterTableComponent,
    CommomTableComponent,
    RouterLink,
    PageHeaderComponent,
    BaseButtonComponent,
  ],
})
export class ConfigListComponent implements OnInit {
  private router = inject(Router);
  private activatedRoute = inject(ActivatedRoute);
  private configService = inject(ConfigService);
  private confirmDialog = inject(ConfirmDialogService);

  public title = 'Configurações';
  public pageSession = 'Configurações';

  // AJUSTAR TIPAGEM NA FASE DE INTEGRAÇÃO
  public searchTerm = signal<string | undefined>(undefined);

  public admins = signal<GetAllCollaborators[]>([]);
  public filteredAdmins = computed(() => {
    const search = this.searchTerm()?.toLowerCase() ?? "";
    const filtered = this.admins().filter(admin =>
      admin.name.toLowerCase().includes(search) ||
      admin.email.toLowerCase().includes(search) ||
      admin.role.toLowerCase().includes(search)
    );
  
    const start = (this.currentPage() - 1) * this.pageSize();
    const end = start + this.pageSize();
  
    return filtered.slice(start, end);
  });

  public currentPage = signal(1);
  public pageSize = signal(10);
  public totalItems = signal(0);

  public displayedColumns: TableColumn[] = [
    { label: 'ID', key: 'id', type: 'text' },
    { label: 'Nome', key: 'name', type: 'text' },
    { label: 'E-mail', key: 'email', type: 'text' },
    { label: 'Acessos', key: 'role', type: 'text' },
    { label: 'Status', key: 'active', type: 'status' },
    // { label: '', key: 'menu', type: 'menu' },
  ];

  ngOnInit(): void {
    this.getAdmins();
  
    effect(() => {
      const search = this.searchTerm()?.toLowerCase() ?? "";
      const filtered = this.admins().filter(admin =>
        admin.name.toLowerCase().includes(search) ||
        admin.email.toLowerCase().includes(search) ||
        admin.role.toLowerCase().includes(search)
      );
  
      this.totalItems.set(filtered.length);
    });
  }

  private getAdmins() {
    this.configService.getAll().subscribe({
      next: (res) => {
        this.admins.set(res.map(admin => ({
          ...admin,
          role: admin.role === 'ADMIN' ? 'Admin' : 'Colaborador'
        })));
        this.totalItems.set(res.length);
      }
    });
  }

  public handlePageChange(event: { page: number; size: number }) {
    this.currentPage.set(event.page);
    this.pageSize.set(event.size);
  }

  public gotoFormPage(): void {
    this.router.navigate(['form'], { relativeTo: this.activatedRoute });
  }

  public gotoEdit(config: any) {
    this.router.navigate(['edit', config.id], { relativeTo: this.activatedRoute });
  }

  public gotoDetails(config: any) {
    this.router.navigate(['edit', config.id], { relativeTo: this.activatedRoute });
  }

  public filter(search: string) {
    this.searchTerm.set(search);
    this.currentPage.set(1); // resetar página ao filtrar
  }
}
