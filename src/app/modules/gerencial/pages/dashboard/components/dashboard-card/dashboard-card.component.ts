import { Component, Input } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { DashbocardInfos } from '../../models/Dashboard.interface';

@Component({
  selector: 'app-dashboard-card',
  standalone: true,
  templateUrl: './dashboard-card.component.html',
  styleUrl: './dashboard-card.component.scss',
  imports: [
    MatCardModule,
    MatIconModule,
  ],
})
export class DashboardCardComponent {
  @Input({ required: true }) info!: DashbocardInfos;
}
