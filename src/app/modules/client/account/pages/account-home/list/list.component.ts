import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Router, RouterModule } from '@angular/router';
import { FilterTableComponent } from '../../../../../shared/components/filter-table/filter-table.component';

interface Category {
  id: string
  name: string
  icon: string
  color: string
}

interface Location {
  id: number
  name: string
  distance: number
  duration: number
  image: string
  categories: string[]
}

@Component({
  selector: 'app-list',
  standalone: true,
  imports: [CommonModule, MatIconModule, MatButtonModule, RouterModule, FilterTableComponent],
  templateUrl: './list.component.html',
  styleUrl: './list.component.scss'
})
export class ListComponent {
  @Input() categories: Category[] = []
  @Input() selectedCategory = "all"

  locations: Location[] = [
    {
      id: 1,
      name: "Nome do local",
      distance: 5,
      duration: 8,
      image: "/assets/images/location-placeholder.jpg",
      categories: ["theater", "music", "dance", "art", "cinema"],
    },
    {
      id: 2,
      name: "Nome do local",
      distance: 5,
      duration: 8,
      image: "/assets/images/location-placeholder.jpg",
      categories: ["theater", "music", "dance", "art", "cinema"],
    },
    {
      id: 3,
      name: "Nome do local",
      distance: 5,
      duration: 8,
      image: "/assets/images/location-placeholder.jpg",
      categories: ["theater", "music", "dance", "art", "cinema"],
    },
    {
      id: 4,
      name: "Nome do local",
      distance: 5,
      duration: 8,
      image: "/assets/images/location-placeholder.jpg",
      categories: ["theater", "music", "dance", "art", "cinema"],
    },
    {
      id: 5,
      name: "Nome do local",
      distance: 5,
      duration: 8,
      image: "/assets/images/location-placeholder.jpg",
      categories: ["theater", "music", "dance", "art", "cinema"],
    },
    {
      id: 6,
      name: "Nome do local",
      distance: 5,
      duration: 8,
      image: "/assets/images/location-placeholder.jpg",
      categories: ["theater", "music", "dance", "art", "cinema"],
    },
  ]

  constructor(private router: Router) {}

  ngOnInit(): void {}

  onFilter(searchTerm: string): void {
    console.log("Filtering by:", searchTerm)
    // Implement filtering logic
  }

  getCategoryColor(categoryId: string): string {
    const category = this.categories.find((c) => c.id === categoryId)
    return category ? category.color : "#192554"
  }

  getCategoryIcon(categoryId: string): string {
    const category = this.categories.find((c) => c.id === categoryId)
    return category ? category.icon : "circle"
  }

  goBack(): void {
    // Implement navigation logic
    console.log("Going back")
  }

  navigateToLocationDetail(locationId: number): void {
    this.router.navigate(["/client/inicio/location", locationId])
  }
}
