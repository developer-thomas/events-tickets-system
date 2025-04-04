import { Component, inject } from '@angular/core';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { Router, ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { CommomTableComponent, TableColumn } from '../../../../shared/components/commom-table/commom-table.component';
import { BaseButtonComponent } from '../../../../shared/components/base-button/base-button.component';
import { FilterTableComponent } from '../../../../shared/components/filter-table/filter-table.component';
import { PageHeaderComponent } from '../../../../shared/components/page-header/page-header.component';
import { NewCouponComponent } from '../new-coupon/new-coupon.component';

@Component({
  selector: 'app-coupons-list',
  standalone: true,
  imports: [PageHeaderComponent, FilterTableComponent, BaseButtonComponent, CommomTableComponent, MatDialogModule],
  templateUrl: './coupons-list.component.html',
  styleUrl: './coupons-list.component.scss'
})
export class CouponsListComponent {
  private router = inject(Router);
  private toastr = inject(ToastrService);
  private activatedRoute = inject(ActivatedRoute);
  private dialog = inject(MatDialog);

  public title = 'Cupons';
  public pageSession = 'Cupons';
  
  // AJUSTAR O ANY QUANDO ESTIVER NA FASE DE INTEGRAÇÃO
  public couponData: any= [];
  
  public displayedColumns: TableColumn[] = [
    { label: 'Código', key: 'code', type: 'text' },
    { label: 'Qt Uso', key: 'useQuantity', type: 'text' },
    { label: 'Data início', key: 'initialDate', type: 'text' },
    { label: 'Vencimento', key: 'endDate', type: 'text' },
    { label: 'Desconto', key: 'discount', type: 'text' },
    { label: '', key: 'menu', type: 'menu' },
  ];
  
  ngOnInit() {
    this.getCoupons();
  }
  
  private getCoupons(search?: string) {
    let coupon = [];
    for (let i = 0; i <= 10; i++) {
      coupon.push({
        code: 'Nome',
        useQuantity: '000',
        initialDate: '00/00/00',
        endDate: '00/00/00',
        discount: '00%',
      })
    }
    this.couponData = coupon;
  }
  
  public filter(search: string) {
    this.getCoupons(search);
  }
  
  deleteCoupon(row: any) {

  }
  
  newCoupon() {
    const dialogRef = this.dialog.open(NewCouponComponent, {
      width: "800px",
      disableClose: true,
    })

    return dialogRef.afterClosed()
  }
}
