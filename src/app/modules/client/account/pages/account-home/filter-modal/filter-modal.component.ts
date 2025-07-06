import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { CategoriesService } from '../../../../../gerencial/pages/categories/categories.service';
import { GetAllCategories } from '../../../../../gerencial/pages/categories/models/GetAllCategories.interface';

interface DateSelection {
  day: number
  selected: boolean
}

@Component({
  selector: 'app-filter-modal',
  standalone: true,
  imports: [CommonModule, MatIconModule, MatFormField, MatLabel, MatSelectModule],
  templateUrl: './filter-modal.component.html',
  styleUrl: './filter-modal.component.scss'
})
export class FilterModalComponent implements OnInit {
  private categoriesService = inject(CategoriesService);

  categories = signal<GetAllCategories[]>([]);

  // Verifica se há userToken no localStorage
  hasUserToken = signal<boolean>(false);

  locations = [
    { id: "home", name: "Casa", icon: "home", selected: false },
    { id: "work", name: "Trabalho", icon: "business", selected: false },
    { id: "current", name: "Localização atual", icon: "location_on", selected: false },
  ]

  months = [
    'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
  ];

  years = Array.from({ length: 5 }, (_, i) => new Date().getFullYear() + i);

  selectedMonth = new Date().getMonth(); // mês atual
  selectedYear = new Date().getFullYear();

  dates: DateSelection[] = [];

  weekDays = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sab"]

  ngOnInit(): void {
    this.checkUserToken();
    this.getAllCategories();
    this.generateCalendarDays();
  }

  checkUserToken(): void {
    const userToken = localStorage.getItem('userToken');
    this.hasUserToken.set(!!userToken);
  }

  // Retorna apenas os locations que devem ser exibidos baseado no userToken
  getVisibleLocations() {
    if (this.hasUserToken()) {
      return this.locations; // Mostra todos os cards
    } else {
      return this.locations.filter(location => location.id === 'current'); // Mostra apenas localização atual
    }
  }

  getAllCategories() {
    this.categoriesService.getAll().subscribe({
      next: (res) => {
        this.categories.set(res);
      }
    })
  }

  generateCalendarDays(): void {
    const firstDayOfMonth = new Date(this.selectedYear, this.selectedMonth, 1).getDay(); // 0 = Domingo
    const daysInMonth = new Date(this.selectedYear, this.selectedMonth + 1, 0).getDate();
  
    const calendar: DateSelection[] = [];
  
    // Adiciona dias "vazios" antes do primeiro dia do mês para alinhamento com o dia da semana correto
    for (let i = 0; i < firstDayOfMonth; i++) {
      calendar.push({ day: 0, selected: false }); // dia 0 significa vazio (não renderiza número)
    }
  
    for (let i = 1; i <= daysInMonth; i++) {
      calendar.push({ day: i, selected: false });
    }
  
    this.dates = calendar;
  }

  constructor(public dialogRef: MatDialogRef<FilterModalComponent>) {}

  selectCategories(typeId: number): void {
    this.categories().forEach((type) => {
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

  // ENVIA OS DADOS SELECIONADOS NO FILTRO PARA O COMPONENT PAI E BUSCA NO RETORNO DA API
  applyFilters(): void {
    const selectedFilters = {
      types: this.categories().filter((t) => t.selected).map((t) => t.id),
      location: this.locations.find((l) => l.selected)?.id || null,
      dates: this.dates.filter((d) => d.selected).map((d) => d.day),
      month: this.selectedMonth,
      year: this.selectedYear
    };
  
    this.dialogRef.close(selectedFilters);
  }

  closeDialog(): void {
    this.dialogRef.close()
  }
}
