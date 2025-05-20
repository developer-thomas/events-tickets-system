import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, EventEmitter, input, Input, OnChanges, Output, signal, SimpleChanges, ViewChild } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatPaginator, MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTable, MatTableDataSource, MatTableModule } from '@angular/material/table';
import { BooleanStatusPipe } from '../../pipes/boolean-status/boolean-status.pipe';

export type TableColumn = {
  label: string;
  key: string;
  type: 'text' | 'date' | 'currency' | 'status' | 'menu';
}

@Component({
  selector: 'app-commom-table',
  standalone: true,
  templateUrl: './commom-table.component.html',
  styleUrl: './commom-table.component.scss',
  imports: [
    CommonModule,
    MatPaginatorModule,
    MatTableModule,
    MatSortModule,
    MatMenuModule,
    MatIconModule,
    BooleanStatusPipe,
  ],
})
export class CommomTableComponent<T> implements OnChanges, AfterViewInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatTable) table!: MatTable<T>;

  // MUDANÇA PARA SIGNALS
  // @Input({ required: true }) data!: T[];
  data = input<T[]>();
  @Input({ required: true }) displayedColumns!: TableColumn[];

  // total de itens para paginação
  @Input() totalItems = 50;
  @Input() public page = 1;
  @Input() public size = 10;

  @Output() detail = new EventEmitter<T>();
  @Output() edit = new EventEmitter<T>();
  @Output() delete = new EventEmitter<T>();
  @Output() pageChange = new EventEmitter<{page: number, size: number}>();

  public dataSource!: MatTableDataSource<T>;
  public displayedColumnsKeys!: string[];

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['data']) {
      this.dataSource = new MatTableDataSource(changes['data'].currentValue);
       // Não configurar o paginator aqui, pois estamos usando paginação do servidor
      // this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    }

    if (changes['displayedColumns']) {
      this.displayedColumnsKeys = changes['displayedColumns'].currentValue.map((column: TableColumn) => column.key);
    }

    // Sincronizar o paginator com os valores recebidos
    if ((changes['page'] || changes['size']) && this.paginator) {
      this.paginator.pageIndex = this.page - 1;
      this.paginator.pageSize = this.size;
    }
  }

  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;
    this.table.dataSource = this.dataSource;
    
    // Sincronizar o paginator com os valores iniciais
    if (this.paginator) {
      this.paginator.pageIndex = this.page - 1;
      this.paginator.pageSize = this.size;
    }
  }

  pagination(event: PageEvent) {
    this.page = event.pageIndex + 1;
    this.size = event.pageSize;
    this.pageChange.emit({page: this.page, size: this.size});
  }

  detailClick(row: T) {
    this.detail.emit(row);
  }

  editClick(row: T) {
    this.edit.emit(row);
  }

  deleteClick(row: T) {
    this.delete.emit(row);
  }
}
