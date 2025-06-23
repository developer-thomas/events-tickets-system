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

  public allEvents: GetOneLocationEvent[] = [];
  public eventsWithFavorites: GetOneLocationEvent[] | undefined = [];


  ngOnInit(): void {
    const userId = localStorage.getItem('userId');
    const isAuth = localStorage.getItem('authToken');

    if(userId) {
      this.userId = Number(userId);
    }

    if(isAuth) {
      this.isAuth = true;
    }
  
  }
  
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['events'] && this.events) {
      this.allEvents = [...this.events]; // salva os eventos originais para poder filtrar
    }
    this.getUserFavoriteEvents()
  }

  onFilter(searchTerm: string): void {
    this.filterChange.emit(searchTerm);

    if (!searchTerm || searchTerm.trim() === '') {
      this.events = [...this.allEvents]; // mostra tudo se não tiver filtro
      return;
    }

    const normalizedTerm = searchTerm.toLowerCase();

    this.events = this.allEvents.filter(event =>
      event.name.toLowerCase().includes(normalizedTerm) ||
      event.description?.toLowerCase().includes(normalizedTerm)
    );
  }

  toggleFavorite(id: any): void {
    const eventId = id;
    const userId = this.userId;
  
    if (userId) {
      this.favoritesService.favoriteAnEvent({ eventId, userId }).subscribe({
        next: (res) => {
          const updateFavoriteStatus = (list: GetOneLocationEvent[] | undefined) => {
            const index = list?.findIndex(event => event.id === eventId);
            if (index !== undefined && index > -1 && list) {
              list[index] = {
                ...list[index],
                isFavorite: !list[index].isFavorite
              };
            }
          };
  
          updateFavoriteStatus(this.events);
          updateFavoriteStatus(this.allEvents);
  
          if (res.status === 'added') {
            this.toastr.success('Evento adicionado aos favoritos');
          } else if (res.status === 'removed') {
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

  navigateToEventDetail(eventId: number): void {
    this.router.navigate(['event', eventId], { relativeTo: this.route });
  }

  getUserFavoriteEvents() {
    const userId = this.userId.toString();
    this.favoritesService.getFavorites(userId).subscribe({
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

  onImgError(event: Event) {
    const imgElement = event.target as HTMLImageElement;
    imgElement.src = 'assets/images/no-image.jpg';
  }
}
