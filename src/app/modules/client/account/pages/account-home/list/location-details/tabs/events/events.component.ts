import { CommonModule } from '@angular/common';
import { Component, EventEmitter, inject, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { ActivatedRoute, Router } from '@angular/router';
import { FilterTableComponent } from '../../../../../../../../shared/components/filter-table/filter-table.component';
import { GetOneLocationEvent } from '../../../../models/GetOneLocations.interface'
import { FavoritesService } from '../../../../../favorites/favorites.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-events',
  standalone: true,
  imports: [CommonModule, MatIconModule, MatButtonModule, FilterTableComponent],
  templateUrl: './events.component.html',
  styleUrl: './events.component.scss'
})
export class EventsComponent implements OnInit, OnChanges {
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private favoritesService = inject(FavoritesService);
  private toastr = inject(ToastrService);

  userId!: number;
  isAuth: boolean = false;

  @Input() events: GetOneLocationEvent[] | undefined = []
  @Input() eventTypes: string[] = []

  @Output() filterChange = new EventEmitter<string>()
  @Output() favoriteToggle = new EventEmitter<Event>()

  ngOnInit(): void {
    const userId = localStorage.getItem('userId');
    const isAuth = localStorage.getItem('authToken');

    if(userId) {
      this.userId = Number(userId);
    }

    if(isAuth) {
      this.isAuth = true;
    }

    this.getUserFavoriteEvents()
  }
  
  ngOnChanges(changes: SimpleChanges): void {
    console.log('events', this.events)
    
  }

  onFilter(searchTerm: string): void {
    this.filterChange.emit(searchTerm)
  }

  toggleFavorite(id: any): void {
    const eventId = id;
    const userId = this.userId;

    console.log(eventId, userId);

      // Atualiza visualmente o estado de favorito localmente
    const eventIndex = this.events?.findIndex(event => event.id === eventId);
    if (eventIndex !== undefined && eventIndex > -1 && this.events) {
      const current = this.events[eventIndex];
      this.events[eventIndex] = {
        ...current,
        isFavorite: !current.isFavorite
      };
    }

    if(userId) {
      this.favoritesService.favoriteAnEvent({eventId, userId}).subscribe({
        next: (res) => {
          if(res.status === 'added') {
            this.toastr.success('Evento adicionado aos favoritos')
          } else if (res.status === 'removed') {
            this.toastr.success('Evento removido dos favoritos')
          }
        }, error: (err) => {
          this.toastr.error('Erro ao adicionar aos favoritos')
        }
      })
    } else {
      alert("Você precisa estar logado");
    }
  }

  navigateToEventDetail(eventId: number): void {
    this.router.navigate(['event', eventId], { relativeTo: this.route });
  }

  getUserFavoriteEvents() {
    this.favoritesService.getFavorites(this.userId).subscribe({
      next: (res) => {
        const favoriteIds = res.map((fav: any) => fav.id);
  
        this.events = this.events?.map(event => ({
          ...event,
          isFavorite: favoriteIds.includes(event.id)
        }));
      },
      error: (err) => {
        console.error('Erro ao buscar favoritos', err);
      }
    });
  }
}
