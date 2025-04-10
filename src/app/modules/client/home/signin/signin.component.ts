import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { HomeService } from '../../../home/home.service';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-signin',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatButtonModule,
    RouterLink,
    
  ],
  templateUrl: './signin.component.html',
  styleUrl: './signin.component.scss'
})
export class SigninComponent {
 private fb = inject(FormBuilder);
  private homeService = inject(HomeService);
  private router = inject(Router);
  private toastr = inject(ToastrService);

  public hide = true;

  public form = this.fb.group({
    credential: ['', [Validators.required]],
    password: ['', [Validators.required]],
  });

  public onSubmit() {
    if (this.form.invalid) {
      return;
    }

    // APAGAR ESTE CÓDIGO AO ATIVAR O BLOCO DE CÓDIGO ABAIXO
    this.router.navigate(['/client']);

    // DESATIVAR OS COMENTÁRIOS QUANDO ESTIVER NA ETAPA DE INTEGRAÇÃO
    // this.homeService.signin(this.form.value).subscribe(() => {
    //   this.toastr.success('Login realizado com sucesso!');
    //   this.router.navigate(['/gerencial']);
    // });
  }
}
