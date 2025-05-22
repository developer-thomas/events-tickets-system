import { CommonModule } from '@angular/common';
import { Component, inject, Input, OnInit } from '@angular/core';
import { ReactiveFormsModule, FormGroup, FormBuilder, FormControl, FormArray, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { NgxMaskDirective } from 'ngx-mask';
import { EventService } from '../../../../event.service';

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

  private fb = inject(FormBuilder)
  private eventService = inject(EventService)

  ngOnInit(): void {
    // Verificar se o controle schedule já existe no formGroup
    if (!this.formGroup.get("schedule")) {
      this.formGroup.addControl(
        "schedule",
        this.fb.group({
          items: this.fb.array([this.createScheduleItem()]),
        }),
      )
      this.scheduleForm = this.formGroup.get("schedule") as FormGroup
    } else {
      this.scheduleForm = this.formGroup.get("schedule") as FormGroup

      // Verificar se o controle items já existe
      if (!this.scheduleForm.get("items")) {
        this.scheduleForm.addControl("items", this.fb.array([this.createScheduleItem()]))
      } else if ((this.scheduleForm.get("items") as FormArray).length === 0) {
        // Se o array estiver vazio, adicione um item
        ;(this.scheduleForm.get("items") as FormArray).push(this.createScheduleItem())
      }
    }

    console.log("Schedule form initialized:", this.scheduleForm)
  }

  get scheduleItems(): FormArray {
    return this.scheduleForm.get("items") as FormArray
  }

  createScheduleItem(): FormGroup {
    return this.fb.group({
      date: ["", Validators.required],
      initHour: ["", Validators.required],
      finishHour: ["", Validators.required],
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
