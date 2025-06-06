import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { ActivatedRoute, Router } from '@angular/router';
import { EventDetailsGenericComponent } from '.././../../../../../../shared/components/event-details/event-details.component'

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

  buyTicket(): void {
    this.router.navigate(['client/inicio/cart']);
  }
}
