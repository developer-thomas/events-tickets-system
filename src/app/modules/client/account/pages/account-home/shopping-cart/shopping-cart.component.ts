import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { Router } from '@angular/router';

interface CartItem {
  id: number
  title: string
  venue: string
  image: string
  price: number
  quantity: number
}

@Component({
  selector: 'app-shopping-cart',
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    MatButtonModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
  ],
  templateUrl: './shopping-cart.component.html',
  styleUrl: './shopping-cart.component.scss'
})
export class ShoppingCartComponent {
  cartItems: CartItem[] = [
    {
      id: 1,
      title: "Título do evento",
      venue: "Nome do local",
      image: "assets/images/event-placeholder.jpg",
      price: 150,
      quantity: 1,
    },
    {
      id: 2,
      title: "Título do evento",
      venue: "Nome do local",
      image: "assets/images/event-placeholder.jpg",
      price: 150,
      quantity: 1,
    },
  ]

  couponCode = "Exemplo preenchido"

  constructor(private router: Router) {}

  ngOnInit(): void {}

  get totalTicketsValue(): number {
    return this.cartItems.reduce((total, item) => total + item.price * item.quantity, 0)
  }

  get formattedTotalTicketsValue(): string {
    return `R$ ${this.totalTicketsValue.toFixed(2).replace(".", ",")}`
  }

  get installmentTotal(): string {
    return "R$ 00,00"
  }

  get installmentTax(): string {
    return "R$ 00,00"
  }

  get cashTotal(): string {
    return "R$ 00,00"
  }

  get cashSavings(): string {
    return "R$ 00,00"
  }

  increaseQuantity(item: CartItem): void {
    item.quantity++
  }

  decreaseQuantity(item: CartItem): void {
    if (item.quantity > 1) {
      item.quantity--
    }
  }

  removeItem(itemId: number): void {
    this.cartItems = this.cartItems.filter((item) => item.id !== itemId)
  }

  removeAllItems(): void {
    this.cartItems = []
  }

  applyCoupon(): void {
    console.log("Applying coupon:", this.couponCode)
    // Implement coupon logic here
  }

  goBack(): void {
    window.history.back()
  }

  continueShopping(): void {
    this.router.navigate(["/client/inicio"])
  }

  checkout(): void {
    this.router.navigate(["/client/inicio/cart/checkout"])
  }
}
