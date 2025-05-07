import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';

interface DateSelection {
  day: number
  selected: boolean
}

@Component({
  selector: 'app-filter-modal',
  standalone: true,
  imports: [CommonModule, MatIconModule],
  templateUrl: './filter-modal.component.html',
  styleUrl: './filter-modal.component.scss'
})
export class FilterModalComponent {
  types = [
    { id: "jm", name: "JM Brasil", logo: "assets/map-icons/jm-icon.png", selected: false },
    { id: "arena", name: "Arena da Palavra", logo: "assets/map-icons/arena-icon.png", selected: false },
    { id: "arte", name: "Arte Espaços", logo: "assets/map-icons/arte-icon.png", selected: false },
    { id: "corpo", name: "Corpo", logo: "assets/map-icons/corpo-icon.png", selected: false },
    { id: "rio", name: "Rio", logo: "assets/map-icons/rio-icon.png", selected: false },
  ]

  locations = [
    { id: "home", name: "Casa", icon: "home", selected: false },
    { id: "work", name: "Trabalho", icon: "business", selected: false },
    { id: "current", name: "Localização atual", icon: "location_on", selected: false },
  ]

  weekDays = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sab"]

  dates: DateSelection[] = Array.from({ length: 31 }, (_, i) => ({
    day: i + 1,
    selected: i + 1 >= 8 && i + 1 <= 13, // Pre-select dates 8-13
  }))

  constructor(public dialogRef: MatDialogRef<FilterModalComponent>) {}

  selectType(typeId: string): void {
    this.types.forEach((type) => {
      if (type.id === typeId) {
        type.selected = !type.selected
      }
    })
  }

  selectLocation(locationId: string): void {
    this.locations.forEach((location) => {
      if (location.id === locationId) {
        location.selected = !location.selected
      } else {
        location.selected = false // Only one location can be selected
      }
    })
  }

  toggleDateSelection(date: DateSelection): void {
    date.selected = !date.selected
  }

  applyFilters(): void {
    const selectedFilters = {
      types: this.types.filter((t) => t.selected).map((t) => t.id),
      location: this.locations.find((l) => l.selected)?.id || null,
      dates: this.dates.filter((d) => d.selected).map((d) => d.day),
    }

    this.dialogRef.close(selectedFilters)
  }

  closeDialog(): void {
    this.dialogRef.close()
  }
}
