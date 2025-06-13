import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { Router, RouterModule } from '@angular/router';
import { StorageService } from '../../../../core/auth/storage.service';
import { UserService } from '../../../../core/auth/user.service';
import { LoggedUser } from '../../models/LoggedUser.interrface';

@Component({
  selector: 'app-client-header',
  standalone: true,
  imports: [CommonModule, MatIconModule, MatButtonModule, MatMenuModule, RouterModule],
  templateUrl: './client-header.component.html',
  styleUrl: './client-header.component.scss'
})
export class ClientHeaderComponent implements OnInit{
  private storageService = inject(StorageService);
  private userService = inject(UserService);
  private route = inject(Router)
  userData = signal<LoggedUser | null>(null);

  isAuth!: boolean;

  ngOnInit(): void {
    const authToken = this.storageService.getToken();

    if(authToken) {
      this.isAuth = true;
      this.getUserInfo();
    } else {
      this.isAuth = false;
    }
  }

  getUserInfo() {
    this.userService.getLoggedUser().subscribe({
      next: (res) => {
        this.userData.set(res);
      }
    })
  }

  logout() {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userId');
    this.route.navigate(['/login'])
  }
  
}
