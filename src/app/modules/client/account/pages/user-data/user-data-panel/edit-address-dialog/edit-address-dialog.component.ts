import { CommonModule } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { UserDataService } from '../../userData.service';
import { ToastrService } from 'ngx-toastr';
import { GetUserAddress } from '../../models/CreateAddress.interface';

interface Address {
  id?: number;
  street: string;
  number: string;
  complement?: string;
  zipCode: string;
  city: string;
  state: string;
  referenceType?: 'Home' | 'Job';
}

@Component({
  selector: 'app-edit-address-dialog',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatIconModule,
  ],
  templateUrl: './edit-address-dialog.component.html',
  styleUrl: './edit-address-dialog.component.scss'
})
export class EditAddressDialogComponent implements OnInit {
  addressForm: FormGroup;
  selectedReferenceType: 'Home' | 'Job' = 'Home';
  isLoading = false;
  userAddresses: GetUserAddress[] = [];

  constructor(
    public dialogRef: MatDialogRef<EditAddressDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { address: Address; userId: number },
    private fb: FormBuilder,
    private userDataService: UserDataService,
    private toastr: ToastrService
  ) {
    this.addressForm = this.fb.group({
      id: [null],
      street: ['', Validators.required],
      number: ['', Validators.required],
      complement: [''],
      zipCode: ['', Validators.required],
      city: ['', Validators.required],
      state: ['', Validators.required],
      referenceType: ['Home', Validators.required],
    });
  }

  ngOnInit() {
    this.loadUserAddresses();
  }

  private loadUserAddresses() {
    this.userDataService.getUserAddress(this.data.userId).subscribe({
      next: (addresses) => {
        this.userAddresses = addresses;
        this.loadAddressByType(this.selectedReferenceType);
      },
      error: (error) => {
        console.error('Erro ao carregar endereços:', error);
        // Não mostrar erro, apenas deixar o formulário vazio
      }
    });
  }

  private loadAddressByType(referenceType: 'Home' | 'Job') {
    const existingAddress = this.userAddresses.find(addr => addr.referenceType === referenceType);
    
    if (existingAddress) {
      // Carregar endereço existente
      this.addressForm.patchValue({
        id: existingAddress.id,
        street: existingAddress.street,
        number: existingAddress.number.toString(),
        complement: existingAddress.neighborhood,
        zipCode: existingAddress.cep.toString(),
        city: existingAddress.city,
        state: existingAddress.uf,
        referenceType: existingAddress.referenceType
      });
    } else {
      // Limpar formulário para novo endereço
      this.addressForm.patchValue({
        id: null,
        street: '',
        number: '',
        complement: '',
        zipCode: '',
        city: '',
        state: '',
        referenceType: referenceType
      });
    }
  }

  selectReferenceType(type: 'Home' | 'Job'): void {
    this.selectedReferenceType = type;
    this.loadAddressByType(type);
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  onSubmit(): void {
    if (this.addressForm.valid) {
      this.isLoading = true;
      const formValue = this.addressForm.value;
      const payload = {
        id: formValue.id || undefined, // Envia undefined se não tiver id (novo endereço)
        street: formValue.street,
        number: parseInt(formValue.number),
        neighborhood: formValue.complement || '',
        cep: parseInt(formValue.zipCode.replace(/\D/g, '')),
        uf: formValue.state,
        city: formValue.city,
        referenceType: formValue.referenceType
      };

      this.userDataService.registerAddress(payload).subscribe({
        next: (response) => {
          this.toastr.success('Endereço salvo com sucesso!');
          this.dialogRef.close(response);
        },
        error: (error) => {
          this.toastr.error('Erro ao salvar endereço. Tente novamente.');
          this.isLoading = false;
        }
      });
    }
  }
}
