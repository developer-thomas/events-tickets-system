import { CommonModule } from '@angular/common';
import { Component, ElementRef, inject, OnInit, signal, ViewChild } from '@angular/core';
import { ReactiveFormsModule, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { Router } from '@angular/router';
import { NgxMaskDirective } from 'ngx-mask';
import { PageHeaderComponent } from '../../../../shared/components/page-header/page-header.component';
import { BannersService } from '../banners.service';
import { LocationResult } from '../models/GetLocationsName.interface';
import { ConvertbasefileService } from '../../../../shared/services/convert-base64/convertbasefile.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-new-banner',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
    NgxMaskDirective,
    PageHeaderComponent,
  ],
  templateUrl: './new-banner.component.html',
  styleUrl: './new-banner.component.scss'
})
export class NewBannerComponent implements OnInit {
  private bannersService = inject(BannersService)
  private fb = inject(FormBuilder)
  private router = inject(Router)
  private toastr = inject(ToastrService);

  bannerForm!: FormGroup
  bannerImage: File | null = null

  @ViewChild("fileInput") fileInput!: ElementRef<HTMLInputElement>

  mediaTypes = [
    { value: "image", label: "Imagem" },
    { value: "video", label: "Vídeo" },
  ]

  locations = signal<LocationResult[]>([])

  ngOnInit(): void {
    this.initForm()
    this.getLocationsNames()
  }

  initForm(): void {
    this.bannerForm = this.fb.group({
      title: ["", Validators.required],
      locationId: ["", Validators.required],
      mediaType: ["image", Validators.required],
      startDate: ["", Validators.required],
      endDate: ["", Validators.required],
      videoUrl: [""],
      image: [null],
    })

    this.bannerForm.get("mediaType")?.valueChanges.subscribe((mediaType) => {
      if (mediaType === "image") {
        this.bannerForm.get("image")?.setValidators(Validators.required)
        this.bannerForm.get("videoUrl")?.clearValidators()
      } else {
        this.bannerForm.get("videoUrl")?.setValidators(Validators.required)
        this.bannerForm.get("image")?.clearValidators()
      }

      this.bannerForm.get("image")?.updateValueAndValidity()
      this.bannerForm.get("videoUrl")?.updateValueAndValidity()
    })
  }

  getLocationsNames() {
    this.bannersService.getLocationsNames().subscribe({
      next: (res) => {
        this.locations.set(res)
      },
      error: (err) => {
        console.error("Erro ao buscar locais:", err)
      },
    })
  }

  onImageSelected(event: Event): void {
    const input = event.target as HTMLInputElement
    if (input.files && input.files.length) {
      this.bannerImage = input.files[0]
      this.bannerForm.patchValue({
        image: this.bannerImage,
      })
    }
  }

  onSubmit(): void {
    if (this.bannerForm.valid) {
      // Obter os valores do formulário
      const formValues = this.bannerForm.value

      // Preparar os dados básicos do banner
      const bannerData = {
        title: formValues.title,
        eventLocationId: Number.parseInt(formValues.locationId),
        dateInit: formValues.startDate,
        dateFinish: formValues.endDate,
        videoLink: this.isVideoType ? formValues.videoUrl : "",
      }

      // Enviar os dados para o serviço
      if (this.isImageType) {
        // Se for imagem, enviar o arquivo junto com os dados
        this.bannersService.create(bannerData, this.bannerImage || undefined).subscribe({
          next: this.handleSuccess.bind(this),
          error: this.handleError.bind(this),
        })
      } else {
        // Se for vídeo, enviar apenas os dados
        this.bannersService.create(bannerData).subscribe({
          next: this.handleSuccess.bind(this),
          error: this.handleError.bind(this),
        })
      }
    } else {
      this.markFormGroupTouched(this.bannerForm)
    }
  }

  handleSuccess(response: any): void {
    this.toastr.success("Banner criado com sucesso!")
    this.router.navigate(["/gerencial/banners"])
  }

  handleError(error: any): void {
    this.toastr.error("Erro ao criar banner", error.error.message)
    
  }

  cancel(): void {
    this.router.navigate(["/gerencial/banners"])
  }

  private markFormGroupTouched(formGroup: FormGroup): void {
    Object.values(formGroup.controls).forEach((control) => {
      control.markAsTouched()
    })
  }

  get isImageType(): boolean {
    return this.bannerForm.get("mediaType")?.value === "image"
  }

  get isVideoType(): boolean {
    return this.bannerForm.get("mediaType")?.value === "video"
  }
}
