import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { GetOneLocationEvent } from '../../../../models/GetLocationById.interface';

@Component({
  selector: 'app-event-card',
  standalone: true,
  imports: [MatCardModule, MatIconModule, MatSlideToggleModule],
  templateUrl: './event-card.component.html',
  styleUrl: './event-card.component.scss'
})
export class EventCardComponent implements OnChanges {
  @Input() event!: GetOneLocationEvent | undefined;

  @Output() delete = new EventEmitter<number>()
  @Output() edit = new EventEmitter<number>()
  @Output() toggleActive = new EventEmitter<{ id: number; active: boolean }>()
  @Output() goToDetails = new EventEmitter();

  onDelete(): void {
    // this.delete.emit(this.event.id)
  }

  onEdit(): void {
    // this.edit.emit(this.event.id)
  }

  onToggle(event: any): void {
    // this.toggleActive.emit({
    //   id: this.event.id,
    //   active: event.checked,
    // })
  }

  // Método para enviar os dados do evento para o component pai, a intenção é redirecionar para os detalhes
  // do evento através do ID
  onClick(event: any): void {
    this.goToDetails.emit(event);
  }

  ngOnChanges(changes: SimpleChanges): void {
    console.log('oi', this.event)
  }
}
