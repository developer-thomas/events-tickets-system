import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { AuthService } from '../../core/auth/auth.service';
import { ClientFooterComponent } from '../shared/components/client-footer/client-footer.component';
import { ClientHeaderComponent } from '../shared/components/client-header/client-header.component';

@Component({
  selector: 'app-confirm-email-code',
  standalone: true,
  imports: [RouterModule],
  template: `
      <div class="h-full">
        <router-outlet></router-outlet>
      </div>
  `
})
export class ConfirmEmailCodeComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private code = signal<string | null>(null);
  private authService = inject(AuthService);
  ngOnInit(): void {
    this.route.params.subscribe({
      next: (res) => {
        console.log(res)
        this.code.set(res['code'])
        this.verifyCode();
      },
      error: (err) => {
        console.error(err)
      }
    });
  }

  verifyCode() {
    this.authService.confirmEmail(this.code()).subscribe({
      next: (res) => {
        console.log(res)
        this.router.navigate(['/confirm/sucess'])
      },
      error: (err) => {
        console.log(err)
        this.router.navigate(['/confirm/error'])
      }
    })
  }
}
