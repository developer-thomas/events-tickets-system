import { Location } from '@angular/common';
import { Component, inject, OnInit, ViewChildren } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckbox, MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { NgxMaskDirective } from 'ngx-mask';
import { ToastrService } from 'ngx-toastr';
import { BaseButtonComponent } from '../../../../../shared/components/base-button/base-button.component';
import { PageHeaderComponent } from '../../../../../shared/components/page-header/page-header.component';
import { ConfigPermissionResponse, ConfigService } from '../../config.service';

@Component({
  selector: 'app-config-form',
  standalone: true,
  templateUrl: './config-form.component.html',
  styleUrl: './config-form.component.scss',
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatRadioModule,
    MatSelectModule,
    MatCheckboxModule,
    NgxMaskDirective,
    PageHeaderComponent,
    BaseButtonComponent,
  ],
})
export class ConfigFormComponent implements OnInit {
  private location = inject(Location);
  private configService = inject(ConfigService);
  private fb = inject(FormBuilder);
  private toastr = inject(ToastrService);

  @ViewChildren('permission') checkboxes!: MatCheckbox[];

  public title = 'Configurações';
  public pageSession = 'Novo Colaborador';
  public hide = true;
  public permissions: ConfigPermissionResponse[] | any= [];

  public form = this.fb.group({
    name: ['', [Validators.required]],
    cpf: ['', [Validators.required]],
    email: ['', [Validators.required]],
    password: ['', [Validators.required]],
  });

  ngOnInit(): void {
    this.getPermissions();
  }

  private getPermissions(): void {
    this.permissions = [
      { id: 1, title: 'Dashboard', checked: false },
      { id: 2, title: 'Usuários', checked: false },
      { id: 3, title: 'Local', checked: false },
      { id: 4, title: 'Evento', checked: false },
      { id: 5, title: 'Banners', checked: false },
      { id: 6, title: 'Categorias', checked: false },
      { id: 7, title: 'Ingressos', checked: false },
      { id: 8, title: 'Cupons', checked: false },
      { id: 9, title: 'Financeiro', checked: false },
      { id: 10, title: 'Acessos', checked: false },
    ]
  }

  public goBack(): void {
    this.location.back();
  }

  public submit(): void {
    
    // DESCOMENTAR NA FASE DE INTEGRAÇÃO
    // const permissions = this.checkboxes.filter((c) => c.checked).map((c) => c.value);

    // if (this.form.invalid || !permissions.length) {
    //   this.toastr.error('Preencha todos os campos obrigatórios!');
    //   return;
    // }

    // const data = { ...this.form.value, permissions };

    // this.configService.save(data).subscribe(() => {
    //   this.toastr.success('Colaborador cadastrado com sucesso!');
    //   this.goBack();
    // });
  }
}
