import { Location } from '@angular/common';
import { Component, inject, OnInit, QueryList, ViewChildren } from '@angular/core';
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
  private location = inject(Location)
  private configService = inject(ConfigService)
  private fb = inject(FormBuilder)
  private toastr = inject(ToastrService)

  @ViewChildren("permission") checkboxes!: QueryList<MatCheckbox>

  public title = "Configurações"
  public pageSession = "Novo Colaborador"
  public hide = true
  public permissions: ConfigPermissionResponse[] = []
  public showPermissionError = false

  public form = this.fb.group({
    name: ["", [Validators.required]],
    cpf: ["", [Validators.required]],
    email: ["", [Validators.required, Validators.email]],
    password: ["", [Validators.required]],
    phone: ["", [Validators.required]],
  })

  ngOnInit(): void {
    this.getPermissions()
  }

  private getPermissions(): void {
    this.permissions = [
      { id: 1, title: "Dashboard", checked: false },
      { id: 2, title: "Usuários", checked: false },
      { id: 3, title: "Local", checked: false },
      { id: 4, title: "Evento", checked: false },
      { id: 5, title: "Banners", checked: false },
      { id: 6, title: "Categorias", checked: false },
      { id: 7, title: "Ingressos", checked: false },
      { id: 8, title: "Cupons", checked: false },
      { id: 9, title: "Financeiro", checked: false },
      { id: 10, title: "Acessos", checked: false },
    ]
  }

  public goBack(): void {
    this.location.back()
  }

  public submit(): void {
    const permissions = this.permissions.filter((p) => p.checked).map((p) => p.id)

    if (this.form.invalid) {
      this.form.markAllAsTouched()
      this.toastr.error("Preencha todos os campos obrigatórios!")
      return
    }

    if (!permissions.length) {
      this.showPermissionError = true
      this.toastr.error("Selecione pelo menos uma permissão!")
      return
    }

    this.showPermissionError = false

    const data = {
      name: this.form.value.name || "",
      email: this.form.value.email || "",
      password: this.form.value.password || "",
      cpf: this.form.value.cpf || "",
      phone: this.form.value.phone || "",
      permissions: permissions,
    }

    // Enviar os dados para o backend
    this.configService.save(data).subscribe({
      next: (response) => {
        this.toastr.success("Colaborador cadastrado com sucesso!")
        this.goBack()
      },
      error: (error) => {
        console.error("Erro ao cadastrar colaborador:", error)
        this.toastr.error("Erro ao cadastrar colaborador. Tente novamente.")
      },
    })
  }
}
