import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { ReactiveFormsModule, FormGroup, FormBuilder, FormControl, FormArray, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { NgxMaskDirective } from 'ngx-mask';

interface ScheduleItem {
  date: string
  time: string
  description: string
}

@Component({
  selector: 'app-step-two',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatInputModule,
    MatFormFieldModule,
    MatButtonModule,
    MatIconModule,
    NgxMaskDirective,
  ],
  templateUrl: './step-two.component.html',
  styleUrl: './step-two.component.scss'
})
export class StepTwoComponent implements OnInit{
  @Input() formGroup!: FormGroup
  scheduleForm!: FormGroup

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    if (!this.formGroup.get("schedule")) {
      this.formGroup.addControl(
        "schedule",
        this.fb.group({
          items: this.fb.array([this.createScheduleItem()]),
        }),
      )
    } else if (!this.formGroup.get("schedule")?.get("items")) {
      (this.formGroup.get("schedule") as FormGroup).addControl("items", this.fb.array([this.createScheduleItem()]))
    }

    this.scheduleForm = this.formGroup.get("schedule") as FormGroup
  }

  get scheduleItems(): FormArray {
    return this.scheduleForm.get("items") as FormArray
  }

  createScheduleItem(): FormGroup {
    return this.fb.group({
      date: ["", Validators.required],
      time: ["", Validators.required],
      description: ["", Validators.required],
    })
  }

  addScheduleItem(): void {
    this.scheduleItems.push(this.createScheduleItem())
  }

  removeScheduleItem(index: number): void {
    if (this.scheduleItems.length > 1) {
      this.scheduleItems.removeAt(index)
    } else {
      // se for o último item, apenas reseta os campos
      this.scheduleItems.at(0).reset()
    }
  }
}
