import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sucess',
  standalone: true,
  imports: [],
  templateUrl: './sucess.component.html',
  styleUrl: './sucess.component.scss'
})
export class SucessComponent {
  private router = inject(Router)

  goToLogin() {
    this.router.navigate(['/login'])
  }
}
