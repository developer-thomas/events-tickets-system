import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';
import { FilterTableComponent } from '../../../../../shared/components/filter-table/filter-table.component';
import { ListComponent } from '../list/list.component';
import { MatDialog } from '@angular/material/dialog';
import { FilterModalComponent } from '../filter-modal/filter-modal.component';

interface Category {
  id: string
  name: string
  icon: string
  
}

@Component({
  selector: 'app-map',
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    MatButtonModule,
    RouterModule,
    FilterTableComponent,
    ListComponent
  ],
  templateUrl: './map.component.html',
  styleUrl: './map.component.scss'
})
export class MapComponent {
  viewMode: "map" | "list" = "map"

  categories: Category[] = [
    { id: "all", name: "Todos", icon: "assets/map-icons/jm-icon.png" },
    { id: "theater", name: "Teatro", icon: "assets/map-icons/arena-icon.png" },
    { id: "music", name: "Música", icon: "assets/map-icons/arte-icon.png" },
    { id: "dance", name: "Dança", icon: "assets/map-icons/corpo-icon.png" },
    { id: "art", name: "Arte", icon: "assets/map-icons/rio-icon.png" },
  ]

  selectedCategory = "all"

  constructor(private dialog: MatDialog) {}

  ngOnInit(): void {}

  toggleView(): void {
    this.viewMode = this.viewMode === "map" ? "list" : "map"
  }

  selectCategory(categoryId: string): void {
    this.selectedCategory = categoryId
  }

  onFilter(searchTerm: string): void {
    // Open the filter modal
    const dialogRef = this.dialog.open(FilterModalComponent, {
      width: "90%",
      maxWidth: "500px",
      panelClass: "filter-dialog",
    })

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        console.log("Filtering by:", searchTerm, "with options:", result)
        // Implement filtering logic with both search term and filter options
      }
    })
  }
}
