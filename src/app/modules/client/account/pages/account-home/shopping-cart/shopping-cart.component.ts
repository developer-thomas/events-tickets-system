import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { Router } from '@angular/router';
import { AccountHomeService } from '../account-home.service';
import { CartRequest } from '../models/AddToCart.interface';
import { Cart, CartItemDisplay } from '../models/GetCart.interface';

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
  private router = inject(Router)
  private accountHomeService = inject(AccountHomeService)

  cartItems = signal<CartItemDisplay[]>([])
  couponCode = ""
  loading = signal(false)
  userId = Number(localStorage.getItem("userId")) || 1

  ngOnInit(): void {
    this.loadCart()
  }

  loadCart(): void {
    this.loading.set(true)
    this.accountHomeService.getCart(this.userId).subscribe({
      next: (cart: Cart) => {
        console.log("Cart loaded:", cart)
        const displayItems: CartItemDisplay[] = cart.items.map((item) => ({
          id: item.id,
          eventId: item.eventId,
          title: item.event.name,
          venue: item.event.eventLocation.name,
          fileUrl: item.event.fileUrl,
          price: item.value,
          quantity: item.quantity,
          cartId: cart.id,
        }))
        this.cartItems.set(displayItems)
        this.loading.set(false)
      },
      error: (error) => {
        console.error("Error loading cart:", error)
        this.loading.set(false)
      },
    })
  }

  get totalTicketsValue(): number {
    return this.cartItems().reduce((total, item) => total + item.price * item.quantity, 0)
  }

  get formattedTotalTicketsValue(): string {
    return `R$ ${this.totalTicketsValue.toFixed(2).replace(".", ",")}`
  }

  get totalValue(): string {
    return `R$ ${this.totalTicketsValue.toFixed(2).replace(".", ",")}`
  }

  increaseQuantity(item: CartItemDisplay): void {
    const cartRequest: CartRequest = {
      userId: this.userId,
      item: {
        eventId: item.eventId,
        quantity: 1,
        value: item.price,
      },
    }

    this.accountHomeService.addItemsToCart(cartRequest).subscribe({
      next: () => {
        // Atualizar localmente
        const currentItems = this.cartItems()
        const updatedItems = currentItems.map((cartItem) =>
          cartItem.id === item.id ? { ...cartItem, quantity: cartItem.quantity + 1 } : cartItem,
        )
        this.cartItems.set(updatedItems)
      },
      error: (error) => {
        console.error("Error increasing quantity:", error)
      },
    })
  }

  decreaseQuantity(item: CartItemDisplay): void {
    if (item.quantity <= 1) {
      this.removeItem(item.id)
      return
    }

    const cartRequest: CartRequest = {
      userId: this.userId,
      item: {
        eventId: item.eventId,
        quantity: 1,
        value: item.price,
      },
    }

    this.accountHomeService.remoteItemFromCart(cartRequest).subscribe({
      next: () => {
        // Atualizar localmente
        const currentItems = this.cartItems()
        const updatedItems = currentItems.map((cartItem) =>
          cartItem.id === item.id ? { ...cartItem, quantity: cartItem.quantity - 1 } : cartItem,
        )
        this.cartItems.set(updatedItems)
      },
      error: (error) => {
        console.error("Error decreasing quantity:", error)
      },
    })
  }

  removeItem(itemId: number): void {
    const item = this.cartItems().find((i) => i.id === itemId)
    if (!item) return

    const cartRequest: CartRequest = {
      userId: this.userId,
      item: {
        eventId: item.eventId,
        quantity: item.quantity,
        value: item.price,
      },
    }

    this.accountHomeService.remoteItemFromCart(cartRequest).subscribe({
      next: () => {
        // Remover localmente
        const currentItems = this.cartItems()
        const updatedItems = currentItems.filter((cartItem) => cartItem.id !== itemId)
        this.cartItems.set(updatedItems)
      },
      error: (error) => {
        console.error("Error removing item:", error)
      },
    })
  }

  removeAllItems(): void {
    const currentItems = this.cartItems()

    // Remover todos os itens um por um
    const removePromises = currentItems.map((item) => {
      const cartRequest: CartRequest = {
        userId: this.userId,
        item: {
          eventId: item.eventId,
          quantity: item.quantity,
          value: item.price,
        },
      }
      return this.accountHomeService.remoteItemFromCart(cartRequest).toPromise()
    })

    Promise.all(removePromises)
      .then(() => {
        this.cartItems.set([])
      })
      .catch((error) => {
        console.error("Error removing all items:", error)
      })
  }

  applyCoupon(): void {
    console.log("Applying coupon:", this.couponCode)
    // TODO: Implementar lógica de cupom quando a API estiver disponível
  }

  goBack(): void {
    window.history.back()
  }

  continueShopping(): void {
    this.router.navigate(["/client/inicio"])
  }

  checkout(): void {
    this.accountHomeService.generatePaymentLink().subscribe({
      next:(res) => {
        console.log(res.message)
        window.open(res.message, '_blank');

      }
    })
  }
}
