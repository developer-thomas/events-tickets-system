import { Location } from '@angular/common';
import { Component, inject, Input, OnInit, ViewChildren } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckbox, MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { NgxMaskDirective } from 'ngx-mask';
import { ToastrService } from 'ngx-toastr';
import { BaseButtonComponent } from '../../../../../shared/components/base-button/base-button.component';
import { PageHeaderComponent } from '../../../../../shared/components/page-header/page-header.component';
import { ConfigService } from '../../config.service';

@Component({
  selector: 'app-config-edit',
  standalone: true,
  templateUrl: './config-edit.component.html',
  styleUrl: './config-edit.component.scss',
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatRadioModule,
    MatSelectModule,
    MatSlideToggleModule,
    MatCheckboxModule,
    NgxMaskDirective,
    PageHeaderComponent,
    BaseButtonComponent,
  ],
})
export class ConfigEditComponent implements OnInit {
  private location = inject(Location);
  private configService = inject(ConfigService);
  private fb = inject(FormBuilder);
  private toastr = inject(ToastrService);

  @Input() id!: string;
  @ViewChildren('permission') checkboxes!: MatCheckbox[];

  public title = 'Configurações';
  public pageSession = 'Novo Colaborador';
  public status!: boolean;
  public permissions: any[] = [];

  public form = this.fb.group({
    name: ['', [Validators.required]],
    cpf: ['', [Validators.required]],
    email: ['', [Validators.required]],
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
    // DESCOMENTAR NA FASE DE INTEGRAÇÃO 
    // this.configService.getPermissions().subscribe((response) => {
    //   this.permissions = response.map((p) => ({ ...p, checked: false }));
    //   this.getAdmin();
    // });
  }

  private getAdmin(): void {


    // DESCOMENTAR NA FASE DE INTEGRAÇÃO 
    // this.configService.getById(this.id).subscribe((response) => {
    //   this.form.patchValue(response);
    //   this.permissions.forEach((p) => {
    //     p.checked = response.permissions.includes(p.id);
    //   });
    //   this.status = response.active;
    // });
  }

  public changeStatus(): void {
    this.configService.updateStatus(this.id).subscribe(() => {
      this.toastr.success('Status alterado com sucesso!');
      this.goBack();
    });
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
