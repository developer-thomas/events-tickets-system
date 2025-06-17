import { Component, inject } from '@angular/core';
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

  public user: any | null = {
    name: 'Paulo Ricardo',
    imageUrl: 'assets/png/default-user.jpg',
  };

  logout() {
    this.router.navigate(['/admin']);
    localStorage.removeItem('authToken');
    localStorage.removeItem('permissions');
    localStorage.removeItem('role');
  }

  public username!: string;

  ngOnInit(): void {
    this.userService.getLoggedUser().subscribe({
      next: (res) => {
        this.user = {
          name: res.name,
          imageUrl: res.imageUrl
        }
      }
    })
  }
}
