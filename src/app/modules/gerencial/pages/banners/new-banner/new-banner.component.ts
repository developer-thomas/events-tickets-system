import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ReactiveFormsModule, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { Router } from '@angular/router';
import { NgxMaskDirective } from 'ngx-mask';
import { PageHeaderComponent } from '../../../../shared/components/page-header/page-header.component';

interface Location {
  id: number
  name: string
}

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
  bannerForm!: FormGroup
  bannerImage: File | null = null

  mediaTypes = [
    { value: "image", label: "Imagem" },
    { value: "video", label: "Vídeo" },
  ]

  locations: Location[] = [
    { id: 1, name: "Banner 1" },
    { id: 2, name: "Banner 2" },
    { id: 3, name: "Banner 3" },
    { id: 4, name: "Banner Principal" },
  ]

  constructor(
    private fb: FormBuilder,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.initForm()
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
      console.log("Form submitted:", this.bannerForm.value)
      // Submit form data to backend
      this.router.navigate(["/gerencial/banners"])
    } else {
      this.markFormGroupTouched(this.bannerForm)
    }
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
