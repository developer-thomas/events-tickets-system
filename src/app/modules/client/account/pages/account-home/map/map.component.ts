import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';
import { FilterTableComponent } from '../../../../../shared/components/filter-table/filter-table.component';
import { ListComponent } from '../list/list.component';

interface Category {
  id: string
  name: string
  icon: string
  color: string
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
    { id: "all", name: "Todos", icon: "apps", color: "#192554" },
    { id: "theater", name: "Teatro", icon: "theater_comedy", color: "#cc3131" },
    { id: "music", name: "Música", icon: "music_note", color: "#ebae13" },
    { id: "dance", name: "Dança", icon: "nightlife", color: "#c5a25c" },
    { id: "art", name: "Arte", icon: "palette", color: "#209db3" },
    { id: "cinema", name: "Cinema", icon: "movie", color: "#ff6633" },
    { id: "literature", name: "Literatura", icon: "menu_book", color: "#4728a2" },
    { id: "gastronomy", name: "Gastronomia", icon: "restaurant", color: "#9dcf52" },
  ]

  selectedCategory = "all"

  constructor() {}

  ngOnInit(): void {}

  toggleView(): void {
    this.viewMode = this.viewMode === "map" ? "list" : "map"
  }

  selectCategory(categoryId: string): void {
    this.selectedCategory = categoryId
  }

  onFilter(searchTerm: string): void {
    console.log("Filtering by:", searchTerm)
    // Implement filtering logic
  }
}
