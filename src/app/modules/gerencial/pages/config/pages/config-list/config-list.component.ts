import { Component, computed, inject, OnInit, signal } from '@angular/core';
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
  public filteredAdmins = computed(() =>
    this.admins().filter((admin) => {
      const search = this.searchTerm()?.toLowerCase() ?? "";
      return (
        admin.name.toLowerCase().includes(search) ||
        admin.email.toLowerCase().includes(search) ||
        admin.role.toLowerCase().includes(search)
      );
    })
  );

  public displayedColumns: TableColumn[] = [
    { label: 'ID', key: 'id', type: 'text' },
    { label: 'Nome', key: 'name', type: 'text' },
    { label: 'E-mail', key: 'email', type: 'text' },
    { label: 'Acessos', key: 'role', type: 'text' },
    { label: 'Status', key: 'active', type: 'status' },
    { label: '', key: 'menu', type: 'menu' },
  ];

  ngOnInit(): void {
    this.getAdmins();
  }

  private getAdmins(search?: string): void {
    this.configService.getAll(1, 10, search).subscribe({
      next: (res) => {
        const data = res;
        this.admins.set(data.map((admin) => ({
          ...admin,
          role: admin.role === 'ADMIN' ? 'Admin' : 'Colaborador'
        })));
      }
    })
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
  }
}
