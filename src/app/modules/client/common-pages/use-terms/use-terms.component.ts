import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-use-terms',
  standalone: true,
  imports: [],
  templateUrl: './use-terms.component.html',
  styleUrl: './use-terms.component.scss'
})
export class UseTermsComponent {
  constructor(private router: Router) {}

  goBack(): void {
    this.router.navigate(['/client/inicio'])
  }

  email = 'contato@cidadedacultura.com.br'
}
