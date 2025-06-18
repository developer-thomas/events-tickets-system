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
import { FavoritesService } from '../../../../favorites/favorites.service';
import { StorageService } from '../../../../../../../../core/auth/storage.service';

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
  private favoriteService = inject(FavoritesService)
  private storageService = inject(StorageService);

  eventId!: number;
  userId!: number;
  
  isFavorite = false

  ngOnInit(): void {
    this.eventId = Number(this.route.snapshot.paramMap.get("eventId"));
    this.userId = this.storageService.getItem('userId');
  }

  goBack(): void {
    window.history.back()
  }

  toggleFavorite(event: number): void {
    const userId = this.userId;
    const eventToFavorite = {
      eventId: event,
      userId
    }
    this.favoriteService.favoriteAnEvent(eventToFavorite).subscribe({
      next: (res) => {
        if(res.status === 'removed') {
          this.toastr.success('Evento removido dos favoritos');
          this.isFavorite = !this.isFavorite

        } else if (res.status === 'added') {
          this.toastr.success('Evento adicionado aos favoritos');
          this.isFavorite = !this.isFavorite
        }
      }, error: (err) => {
        this.toastr.error('Erro ao adicionar aos favoritos:', err.error.message)
      }
    })
  }

  shareEvent(): void {
    const url = window.location.href; // Ou gere uma URL específica para o evento
    const title = 'Confira este evento!';
    const text = 'Encontrei esse evento incrível e achei que você poderia gostar.';
  
    if (navigator.share) {
      navigator.share({
        title,
        text,
        url,
      }).then(() => {
        console.log('Evento compartilhado com sucesso!');
      }).catch((error) => {
        console.error('Erro ao compartilhar:', error);
      });
    } else {
      // Fallback para navegadores que não suportam Web Share API
      this.toastr.info('Compartilhamento não suportado neste dispositivo.');
    }
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
