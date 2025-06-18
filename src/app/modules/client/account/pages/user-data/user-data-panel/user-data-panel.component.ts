import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { ChangeEmailDialogComponent } from './change-email-dialog/change-email-dialog.component';
import { ChangePasswordDialogComponent } from './change-password-dialog/change-password-dialog.component';
import { EditAddressDialogComponent } from './edit-address-dialog/edit-address-dialog.component';
import { UserService } from '../../../../../../core/auth/user.service';
import { UpdateUser, UserDataService } from '../userData.service';
import { ToastrService } from 'ngx-toastr';
import { CreateAddress, GetUserAddress } from '../models/CreateAddress.interface';
import { UserAddress, UserData } from '../models/UserData.interface';

@Component({
  selector: 'app-user-data-panel',
  standalone: true,
  imports: [CommonModule, MatIconModule, MatButtonModule, MatDialogModule, FormsModule, ReactiveFormsModule],
  templateUrl: './user-data-panel.component.html',
  styleUrl: './user-data-panel.component.scss'
})
export class UserDataPanelComponent implements OnInit {
  private userService = inject(UserService)
  private userDataService = inject(UserDataService)
  private toastr = inject(ToastrService)
  private dialog = inject(MatDialog)

  private userId = signal<number>(0)
  private addressId = signal<number | null>(null)
  loading = signal(false)

  userData: UserData = {
    phone: "",
    name: "",
    cpf: "",
    birthDate: "",
    email: "",
  }

  userAddress: UserAddress = {
    street: "",
    number: "",
    complement: "",
    zipCode: "",
    city: "",
    state: "",
  }

  ngOnInit(): void {
    const userId = Number(localStorage.getItem("userId"))
    this.userId.set(userId)

    if (userId) {
      this.loadUserData()
      this.loadUserAddress()
    }
  }

  loadUserData(): void {
    this.loading.set(true)
    this.userService.getLoggedUser().subscribe({
      next: (res) => {
        console.log("User data:", res)

        // Mapear os dados do usuário para o formato esperado
        this.userData = {
          phone: this.formatPhone(res.phone || ""),
          name: res.name || "",
          cpf: this.formatCPF(res.cpf_cnpj || ""),
          birthDate: this.formatDate(res.dateOfBirth || ""),
          email: res.email || "",
        }

        this.loading.set(false)
      },
      error: (error) => {
        console.error("Error loading user data:", error)
        this.toastr.error("Erro ao carregar dados do usuário")
        this.loading.set(false)
      },
    })
  }

  loadUserAddress(): void {
    this.userDataService.getUserAddress(this.userId()).subscribe({
      next: (res: GetUserAddress[]) => {
        console.log("User address:", res)
        const response = res[0]
        this.addressId.set(response.id)
        this.userAddress = {
          street: response.street || "",
          number: response.number?.toString() || "",
          complement: response.referenceType || "",
          zipCode: this.formatCEP(response.cep?.toString() || ""),
          city: response.city || "",
          state: response.uf || "",
        }
      },
      error: (error) => {
        console.error("Error loading user address:", error)
        // Não mostrar erro se não tiver endereço cadastrado
        if (error.status !== 404) {
          this.toastr.error("Erro ao carregar endereço")
        }
      },
    })
  }

  // Métodos de formatação
  formatPhone(phone: string): string {
    if (!phone) return ""
    const cleaned = phone.replace(/\D/g, "")
    if (cleaned.length === 11) {
      return `(${cleaned.slice(0, 2)})${cleaned.slice(2, 7)}-${cleaned.slice(7)}`
    }
    return phone
  }

  formatCPF(cpf: string): string {
    if (!cpf) return ""
    const cleaned = cpf.replace(/\D/g, "")
    if (cleaned.length === 11) {
      return `${cleaned.slice(0, 3)}.${cleaned.slice(3, 6)}.${cleaned.slice(6, 9)}-${cleaned.slice(9)}`
    }
    return cpf
  }

  formatCEP(cep: string): string {
    if (!cep) return ""
    const cleaned = cep.replace(/\D/g, "")
    if (cleaned.length === 8) {
      return `${cleaned.slice(0, 5)}-${cleaned.slice(5)}`
    }
    return cep
  }

  formatDate(dateString: string): string {
    if (!dateString) return ""
    try {
      const date = new Date(dateString)
      const day = date.getDate().toString().padStart(2, "0")
      const month = (date.getMonth() + 1).toString().padStart(2, "0")
      const year = date.getFullYear().toString().slice(-2)
      return `${day}/${month}/${year}`
    } catch {
      return dateString
    }
  }

  openChangeEmailDialog(): void {
    const dialogRef = this.dialog.open(ChangeEmailDialogComponent, {
      width: "400px",
      height: "500px",
      data: { currentEmail: this.userData.email },
    })

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.updateUserField({ email: result })
      }
    })
  }

  openChangePasswordDialog(): void {
    const dialogRef = this.dialog.open(ChangePasswordDialogComponent, {
      width: "400px",
      height: "500px",
    })

    dialogRef.afterClosed().subscribe((result) => {
      if (result && typeof result === "string") {
        this.updateUserField({ password: result })
      }
    })
  }

  openEditAddressDialog(): void {
    const dialogRef = this.dialog.open(EditAddressDialogComponent, {
      width: "500px",
      height: "600px",
      data: {
        address: this.userAddress,
        hasAddress: !!this.addressId(),
      },
    })

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.saveAddress(result)
      }
    })
  }

  updateUserField(updateData: UpdateUser): void {
    this.loading.set(true)

    this.userDataService.updateUser(updateData).subscribe({
      next: (response) => {
        console.log("User updated:", response)
        this.toastr.success("Dados atualizados com sucesso!")

        // Atualizar os dados localmente
        if (updateData.email) {
          this.userData.email = updateData.email
        }

        this.loading.set(false)
      },
      error: (error) => {
        console.error("Error updating user:", error)
        this.toastr.error("Erro ao atualizar dados")
        this.loading.set(false)
      },
    })
  }

  saveAddress(addressData: any): void {
    this.loading.set(true)

    const createAddressData: CreateAddress = {
      street: addressData.street,
      number: Number(addressData.number),
      neighborhood: addressData.neighborhood || "Centro",
      cep: Number(addressData.zipCode.replace(/\D/g, "")),
      uf: addressData.state,
      city: addressData.city,
      referenceType: addressData.complement || "",
    }

    // Se já tem endereço, inclui o ID para atualizar
    if (this.addressId()) {
      createAddressData.id = this.addressId()!
    }

    this.userDataService.registerAddress(createAddressData).subscribe({
      next: (response) => {
        console.log("Address saved:", response)
        this.toastr.success("Endereço salvo com sucesso!")

        // Atualizar endereço local
        this.userAddress = {
          street: addressData.street,
          number: addressData.number,
          complement: addressData.complement,
          zipCode: addressData.zipCode,
          city: addressData.city,
          state: addressData.state,
        }

        // Se era um novo endereço, salvar o ID retornado
        if (!this.addressId() && response.id) {
          this.addressId.set(response.id)
        }

        this.loading.set(false)
      },
      error: (error) => {
        console.error("Error saving address:", error)
        this.toastr.error("Erro ao salvar endereço")
        this.loading.set(false)
      },
    })
  }

  saveChanges(): void {
    // Este método pode ser usado para salvar todas as alterações de uma vez
    // Por enquanto, apenas mostra uma mensagem
    this.toastr.info("Use os botões específicos para alterar email ou senha")
  }
}
