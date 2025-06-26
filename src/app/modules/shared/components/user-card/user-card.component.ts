import { Component, inject, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { Router } from '@angular/router';
import { UserService } from '../../../../core/auth/user.service';

@Component({
  selector: 'app-user-card',
  standalone: true,
  templateUrl: './user-card.component.html',
  styleUrl: './user-card.component.scss',
  imports: [
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
  ],
})
export class UserCardComponent {
  private router = inject(Router);
  private userService = inject(UserService);
  private usersService = inject(UserService);

  public user = signal<{name: string, imageUrl?: string} | null>(null);

  logout() {
    this.router.navigate(['/admin']);
    this.usersService.clearAdminData();
  }

  public username!: string;

  ngOnInit(): void {
    this.user.set({
      name: localStorage.getItem('name') || '',
    })
  }
}
