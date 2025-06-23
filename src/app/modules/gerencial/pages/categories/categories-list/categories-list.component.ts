import { Component, computed, effect, Inject, inject, OnInit, signal } from '@angular/core';
import { PageHeaderComponent } from '../../../../shared/components/page-header/page-header.component';
import { FilterTableComponent } from '../../../../shared/components/filter-table/filter-table.component';
import { BaseButtonComponent } from '../../../../shared/components/base-button/base-button.component';
import { CommomTableComponent, TableColumn } from '../../../../shared/components/commom-table/commom-table.component';
import { Router, ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { NewCategoryComponent } from '../new-category/new-category.component';
import { GetAllCategories } from '../models/GetAllCategories.interface';
import { CategoriesService } from '../categories.service';
import { ConfirmDialogService } from '../../../../shared/services/confirm-dialog/confirmDialog.service';
import { EditCategoryComponent } from '../edit-category/edit-category.component';

@Component({
  selector: 'app-categories-list',
  standalone: true,
  imports: [PageHeaderComponent, FilterTableComponent, BaseButtonComponent, CommomTableComponent, MatDialogModule],
  templateUrl: './categories-list.component.html',
  styleUrl: './categories-list.component.scss'
})
export class CategoriesListComponent implements OnInit{
  private dialog = inject(MatDialog);
  private categoriesService = inject(CategoriesService);
  private confirmDialog = inject(ConfirmDialogService);
  private toastr = inject(ToastrService);
  private router = inject(Router);

  public title = 'Categorias';
  public pageSession = 'Categorias';
  
  public allCategories = signal<GetAllCategories[]>([]);
  public filteredCategories = signal<GetAllCategories[]>([]);
  
  public displayedColumns: TableColumn[] = [
    { label: 'ID', key: 'id', type: 'text' },
    { label: 'Nome da categoria', key: 'name', type: 'text' },
    { label: '', key: 'menu', type: 'menu' },
  ];
  
  // paginação
  public totalItems = signal<number>(0);
  public currentPage = signal<number>(1);
  public pageSize = signal<number>(10);
  public searchTerm = signal<string | undefined>(undefined);
  
  ngOnInit() {
    this.getCategories();
  }
  
  public paginatedCategories = computed(() => {
    const start = (this.currentPage() - 1) * this.pageSize();
    const end = start + this.pageSize();
    return this.filteredCategories().slice(start, end);
  });

  private getCategories() {
    this.categoriesService.getAll().subscribe({
      next: (res) => {
        this.allCategories.set(res);
        this.filteredCategories.set(res);
        this.totalItems.set(res.length);
      }
    });
  }
  
  public filter(search: string) {
    this.currentPage.set(1);
    this.searchTerm.set(search);
  
    const term = search.toLowerCase();
  
    const filtered = this.allCategories().filter(category =>
      category.name.toLowerCase().includes(term)
    );
  
    this.filteredCategories.set(filtered);
    this.totalItems.set(filtered.length);
  }

  handlePageChange(event: { page: number; size: number }) {
    this.currentPage.set(event.page);
    this.pageSize.set(event.size);
  }
  
  deleteCategory(row: any) {
    this.confirmDialog.confirm('Confirmar exclusão', 'Você tem certeza que deseja excluir este categoria?')
    .then((confirmed) => {
      if (confirmed) {
        this.categoriesService.delete(row.id).subscribe({
          next: () => {
            this.toastr.success('Categoria deletada com sucesso');
            this.getCategories();
          },
          error: (err) => {
            console.error('Erro ao excluir categoria:', err);
            this.toastr.error('Erro ao excluir categoria');
          }
        });
      }
    });
  }
  
  newCategory() {
    const dialogRef = this.dialog.open(NewCategoryComponent, {
      width: "800px",
      disableClose: true,
    })
    
    return dialogRef.afterClosed().subscribe({
      next: (_) => {
        this.getCategories()
      }
    })
  }

  editCategory(row: any) {
    const dialogRef = this.dialog.open(EditCategoryComponent, {
      width: "800px",
      disableClose: true,
      data: { categoryId: row.id }
    })
    
    return dialogRef.afterClosed().subscribe({
      next: (_) => {
        this.getCategories()
      }
    })
  }

  public getPaginatedCategories(): GetAllCategories[] {
    const start = (this.currentPage() - 1) * this.pageSize();
    const end = start + this.pageSize();
    return this.filteredCategories().slice(start, end);
  }
}
