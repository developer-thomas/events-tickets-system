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
      title: "Como posso comprar ingressos para um evento?",
      content:
        "Você pode comprar ingressos acessando a página do evento e clicando em 'Comprar ingresso'. Em seguida, escolha o tipo de ingresso, quantidade e prossiga para o pagamento.",
      isExpanded: true,
    },
    {
      id: 2,
      title: "Quais formas de pagamento são aceitas?",
      content:
        "Aceitamos cartões de crédito, débito, Pix e boleto bancário. Para Pix, o pagamento deve ser confirmado em até 30 minutos.",
      isExpanded: false,
    },
    {
      id: 3,
      title: "Posso cancelar ou trocar meu ingresso?",
      content:
        "Ingressos podem ser cancelados em até 7 dias após a compra, desde que o evento ainda não tenha ocorrido. Trocas não são permitidas.",
      isExpanded: false,
    },
    {
      id: 4,
      title: "Recebi meu ingresso por e-mail?",
      content:
        "Sim! Após a confirmação de pagamento, seu ingresso será enviado para o e-mail cadastrado. Você também pode acessá-lo pelo seu painel de usuário.",
      isExpanded: false,
    },
    {
      id: 5,
      title: "O que acontece se o evento for cancelado?",
      content:
        "Caso o evento seja cancelado, você receberá 100% do valor pago. O reembolso será feito automaticamente no mesmo método utilizado na compra.",
      isExpanded: false,
    },
  ]
  

  constructor(private router: Router) {}

  ngOnInit(): void {}

  toggleFaqItem(item: FaqItem): void {
    item.isExpanded = !item.isExpanded
  }

  goBack(): void {
    this.router.navigate(["/client/inicio"])
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
