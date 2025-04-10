import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-client-header',
  standalone: true,
  imports: [CommonModule, MatIconModule, MatButtonModule, MatMenuModule, RouterModule],
  templateUrl: './client-header.component.html',
  styleUrl: './client-header.component.scss'
})
export class ClientHeaderComponent {

}
