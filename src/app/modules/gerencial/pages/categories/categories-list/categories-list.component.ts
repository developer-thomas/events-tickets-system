import { Component, Inject, inject, OnInit } from '@angular/core';
import { PageHeaderComponent } from '../../../../shared/components/page-header/page-header.component';
import { FilterTableComponent } from '../../../../shared/components/filter-table/filter-table.component';
import { BaseButtonComponent } from '../../../../shared/components/base-button/base-button.component';
import { CommomTableComponent, TableColumn } from '../../../../shared/components/commom-table/commom-table.component';
import { Router, ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { NewCategoryComponent } from '../new-category/new-category.component';

@Component({
  selector: 'app-categories-list',
  standalone: true,
  imports: [PageHeaderComponent, FilterTableComponent, BaseButtonComponent, CommomTableComponent, MatDialogModule],
  templateUrl: './categories-list.component.html',
  styleUrl: './categories-list.component.scss'
})
export class CategoriesListComponent implements OnInit{
  private router = inject(Router);
  private toastr = inject(ToastrService);
  private activatedRoute = inject(ActivatedRoute);
  private dialog = inject(MatDialog);

  public title = 'Categorias';
  public pageSession = 'Categorias';
  
  // AJUSTAR O ANY QUANDO ESTIVER NA FASE DE INTEGRAÇÃO
  public categoryData: any= [];
  
  public displayedColumns: TableColumn[] = [
    { label: 'ID', key: 'id', type: 'text' },
    { label: 'Nome da categoria', key: 'categoryName', type: 'text' },
    { label: '', key: 'menu', type: 'menu' },
  ];
  
  ngOnInit() {
    this.getCategories();
  }
  
  private getCategories(search?: string) {
    let location = [];
    for (let i = 0; i <= 10; i++) {
      location.push({
        id: i,
        categoryName: 'Nome',
      })
    }
    this.categoryData = location;
  }
  
  public filter(search: string) {
    this.getCategories(search);
  }
  
  deleteCategory(row: any) {
   
  }
  
  newCategory() {
    const dialogRef = this.dialog.open(NewCategoryComponent, {
      width: "800px",
      disableClose: true,
    })

    return dialogRef.afterClosed()
  }
}
