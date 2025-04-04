import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { ReactiveFormsModule, FormGroup, FormBuilder, FormArray, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';

interface SponsorCategory {
  id: number
  name: string
}

@Component({
  selector: 'app-step-three',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatInputModule,
    MatFormFieldModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
  ],
  templateUrl: './step-three.component.html',
  styleUrl: './step-three.component.scss'
})
export class StepThreeComponent implements OnInit {
  @Input() formGroup!: FormGroup
  sponsorsForm!: FormGroup

  sponsorCategories: SponsorCategory[] = [
    { id: 1, name: "Categoria" },
    { id: 2, name: "Ouro" },
    { id: 3, name: "Prata" },
    { id: 4, name: "Bronze" },
    { id: 5, name: "Apoiador" },
  ]

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    // Initialize sponsors form group if not already done
    if (!this.formGroup.get("sponsors")) {
      this.formGroup.addControl(
        "sponsors",
        this.fb.group({
          items: this.fb.array([this.createSponsorItem()]),
        }),
      )
    } else if (!this.formGroup.get("sponsors")?.get("items")) {
      // If sponsors exists but items doesn't, add items
      ;(this.formGroup.get("sponsors") as FormGroup).addControl("items", this.fb.array([this.createSponsorItem()]))
    }

    // Set the local sponsorsForm reference
    this.sponsorsForm = this.formGroup.get("sponsors") as FormGroup
  }

  // Helper method to get sponsors items form array
  get sponsorItems(): FormArray {
    return this.sponsorsForm.get("items") as FormArray
  }

  // Create a new sponsor item form group
  createSponsorItem(): FormGroup {
    return this.fb.group({
      name: ["", Validators.required],
      categoryId: ["", Validators.required],
      description: ["", Validators.required],
      logoImage: [null],
    })
  }

  // Add a new sponsor item
  addSponsorItem(): void {
    this.sponsorItems.push(this.createSponsorItem())
  }

  // Remove a sponsor item
  removeSponsorItem(index: number): void {
    if (this.sponsorItems.length > 1) {
      this.sponsorItems.removeAt(index)
    } else {
      // If it's the last item, just reset it instead of removing
      this.sponsorItems.at(0).reset()
    }
  }

  // Upload sponsor logo
  uploadSponsorLogo(event: Event, index: number): void {
    const input = event.target as HTMLInputElement
    if (input.files && input.files.length) {
      const file = input.files[0]
      this.sponsorItems.at(index).get("logoImage")?.setValue(file)
    }
  }
}
