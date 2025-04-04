import { Component, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-product-card',
  standalone: true,
  imports: [],
  templateUrl: './product-card.component.html',
  styleUrl: './product-card.component.scss',
})
export class ProductCardComponent {
  private router = inject(Router);
  private activatedRoute = inject(ActivatedRoute);

  gotoProductDetail() {
    this.router.navigate(['../detail'], { relativeTo: this.activatedRoute });
  }
}
