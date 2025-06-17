import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { ActivatedRoute, Router } from '@angular/router';
import { EventDetailsGenericComponent } from '.././../../../../../../shared/components/event-details/event-details.component'
import { AccountHomeService } from '../../../account-home.service';
import { GetOneEvent } from '../../../../../../../gerencial/pages/event/models/GetEventById.interface';
import { CartRequest } from '../../../models/AddToCart.interface';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-event-details',
  standalone: true,
  imports: [CommonModule, MatIconModule, MatButtonModule, EventDetailsGenericComponent],
  templateUrl: './event-details.component.html',
  styleUrl: './event-details.component.scss'
})
export class EventDetailsComponent {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private accountHomeService = inject(AccountHomeService)
  private toastr = inject(ToastrService);

  eventId!: any;
  isFavorite = false

  ngOnInit(): void {
    this.eventId = this.route.snapshot.paramMap.get("id")
  }

  goBack(): void {
    window.history.back()
  }

  toggleFavorite(event: any): void {
    this.isFavorite = !this.isFavorite
  }

  shareEvent(): void {
    console.log("Sharing event:", this.eventId)
  }

  static getUserId() {
    return localStorage.getItem('userId');
  }

  buyTicket(ticket: GetOneEvent): void {
    const userId = Number(EventDetailsComponent.getUserId());
  
    const payload: CartRequest = {
      userId,
      item: {
        eventId: ticket.id,
        quantity: 1,
        value: ticket.value
      }
    }
    this.accountHomeService.addItemsToCart(payload).subscribe({
      next: (res) => {
        console.log('ingresso adicionado:', res)
        this.toastr.success("Ingresso adicionado ao carrinho");
      }
    })
    this.router.navigate(['client/inicio/cart']);
  }
}
