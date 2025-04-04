import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-document-card',
  standalone: true,
  templateUrl: './document-card.component.html',
  styleUrl: './document-card.component.scss',
  imports: [
    MatIconModule,
  ],
})
export class DocumentCardComponent {

}
