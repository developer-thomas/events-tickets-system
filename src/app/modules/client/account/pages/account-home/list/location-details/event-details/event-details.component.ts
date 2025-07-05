import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
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
export class EventDetailsComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private accountHomeService = inject(AccountHomeService)
  private toastr = inject(ToastrService);
  private favoritesService = inject(FavoritesService)
  private storageService = inject(StorageService);

  eventId!: number;
  userId!: number;
  isAuth: boolean = false;
  
  isFavorite = false;

  ngOnInit(): void {
    this.eventId = Number(this.route.snapshot.paramMap.get("eventId"));
    this.userId = this.storageService.getItem('userId');
    const isAuth = localStorage.getItem('authToken');

    if(isAuth) {
      this.isAuth = true;
    }

    this.getUserFavoriteEvents()
  }

  goBack(): void {
    window.history.back()
  }

  getUserFavoriteEvents() {
    const userId = this.userId.toString();
    this.favoritesService.getFavorites(userId).subscribe({
      next: (res) => {
        const favoriteIds = res.filter((fav: any) => fav.id === this.eventId);
        if(favoriteIds[0].isFavorite === true) {
          this.isFavorite = true;
        }
        
      },
      error: (err: any) => {
        console.error('Erro ao buscar favoritos', err);
      }
    });
  }

  toggleFavorite(id: any): void {
    const eventId = id;
    const userId = this.userId;
  
    if (userId) {
      this.favoritesService.favoriteAnEvent({ eventId, userId }).subscribe({
        next: (res) => { 
          if (res.status === 'added') {
            this.toastr.success('Evento adicionado aos favoritos');
            this.isFavorite = true;
          } else if (res.status === 'removed') {
            this.isFavorite = false;
            this.toastr.success('Evento removido dos favoritos');
          }
        },
        error: (err) => {
          this.toastr.error('Erro ao adicionar/remover dos favoritos');
        }
      });
    } else {
      alert("Você precisa estar logado");
    }
  }

  shareEvent(): void {
    const url = window.location.href;
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

    // if(ticket.value === 0 ) {
    //   this.accountHomeService.addItemsToCart(payload).subscribe({
    //     next: (_) => {
    //       this.toastr.success("Ingresso adquirido com sucesso");
    //     }
    //   })
    // } else {
      this.accountHomeService.addItemsToCart(payload).subscribe({
        next: (_) => {
          this.toastr.success("Ingresso adicionado ao carrinho");
          this.router.navigate(['client/inicio']);
        }
      })
    // }
  }
}
