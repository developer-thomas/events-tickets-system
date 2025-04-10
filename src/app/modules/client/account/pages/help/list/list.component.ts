import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';

interface FaqItem {
  id: number
  title: string
  content: string
  isExpanded: boolean
}


@Component({
  selector: 'app-list',
  standalone: true,
  imports: [CommonModule, MatIconModule, MatButtonModule, FormsModule],
  templateUrl: './list.component.html',
  styleUrl: './list.component.scss'
})
export class ListComponent implements OnInit{
  searchQuery = ""
  currentPage = 1
  itemsPerPage = 5
  totalPages = 3

  faqItems: FaqItem[] = [
    {
      id: 1,
      title: "Título da dúvida",
      content:
        "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
      isExpanded: true,
    },
    {
      id: 2,
      title: "Título da dúvida",
      content:
        "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
      isExpanded: false,
    },
    {
      id: 3,
      title: "Título da dúvida",
      content:
        "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
      isExpanded: false,
    },
    {
      id: 4,
      title: "Título da dúvida",
      content:
        "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
      isExpanded: false,
    },
    {
      id: 5,
      title: "Título da dúvida",
      content:
        "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
      isExpanded: false,
    },
  ]

  constructor(private router: Router) {}

  ngOnInit(): void {}

  toggleFaqItem(item: FaqItem): void {
    item.isExpanded = !item.isExpanded
  }

  goBack(): void {
    this.router.navigate(["/home"])
  }

  search(): void {
    console.log("Searching for:", this.searchQuery)
    // Implement search functionality
  }

  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page
    }
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++
    }
  }

  prevPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--
    }
  }
}
