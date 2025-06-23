import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { Router, RouterLink } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../../../../core/auth/auth.service';
import { PermissionRouteMap } from '../../../shared/utils/permission-route.map';


@Component({
  selector: 'app-signin',
  standalone: true,
  templateUrl: './signin.component.html',
  styleUrl: './signin.component.scss',
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatButtonModule,
    RouterLink,
  ],
})
export class SigninComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);
  private toastr = inject(ToastrService);

  public hide = true;

  public form = this.fb.group({
    email: ['', [Validators.required]],
    password: ['', [Validators.required]],
  });

  public onSubmit() {
    if (this.form.invalid) return;

    const { email, password } = this.form.value;

    if (email && password) {
      this.authService.adminAuth(email, password).subscribe({
        next: (user) => {
          this.toastr.success('Login realizado com sucesso!');

          const permissions = user.permissions ?? [];
          const redirectPath = this.getFirstAllowedRoute(permissions);

          if (redirectPath) {
            this.router.navigate([redirectPath]);
          } else {
            this.router.navigate(['/sem-permissao']);
          }
        },
        error: () => {
          this.toastr.error('Falha no login. Verifique suas credenciais.');
        }
      });
    }
  }

  private getFirstAllowedRoute(permissions: string[]): string | null {
    for (const permission of permissions) {
      const path = PermissionRouteMap[permission];
      if (path) return path;
    }
    return null;
  }
}
