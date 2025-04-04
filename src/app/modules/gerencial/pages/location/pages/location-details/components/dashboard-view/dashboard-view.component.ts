import { CommonModule } from '@angular/common';
import { Component, Input, ViewChild } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { ApexAxisChartSeries, ApexChart, ApexDataLabels, ApexGrid, ApexPlotOptions, ApexStroke, ApexXAxis, ApexYAxis, ChartComponent, NgApexchartsModule } from 'ng-apexcharts';

export type ChartOptions = {
  series: ApexAxisChartSeries
  chart: ApexChart
  dataLabels: ApexDataLabels
  plotOptions: ApexPlotOptions
  xaxis: ApexXAxis
  yaxis: ApexYAxis
  stroke: ApexStroke
  grid: ApexGrid
  colors: string[]
}

interface Purchase {
  eventTitle: string
  userName: string
  quantity: number
  status: string
  price: string
}

@Component({
  selector: 'app-dashboard-view',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatIconModule, NgApexchartsModule],
  templateUrl: './dashboard-view.component.html',
  styleUrl: './dashboard-view.component.scss'
})
export class DashboardViewComponent {
  @Input() events: any[] = []
  @ViewChild("chart") chart!: ChartComponent
  public chartOptions!: Partial<ChartOptions>

  metrics = [
    {
      value: "R$ 3.000.000,00",
      label: "Faturamento",
      percentage: "50,2%",
      isPositive: true,
      iconBgColor: "#2aaa21",
      icon: "attach_money",
    },
    {
      value: "83.706",
      label: "Ingressos vendidos",
      percentage: "50,2%",
      isPositive: true,
      iconBgColor: "#192554",
      icon: "person",
    },
    {
      value: "83.706",
      label: "Total de ingressos",
      percentage: "50,2%",
      isPositive: true,
      iconBgColor: "#ffc87f",
      icon: "person",
    },
  ]

  recentPurchases: Purchase[] = [
    {
      eventTitle: "Título do evento",
      userName: "Nome do usuário",
      quantity: 5,
      status: "Em aberto",
      price: "R$ 00,00",
    },
    {
      eventTitle: "Título do evento",
      userName: "Nome do usuário",
      quantity: 5,
      status: "Em aberto",
      price: "R$ 00,00",
    },
  ]

  constructor() {}

  ngOnInit(): void {
    this.initChartData()
  }

  initChartData(): void {
    this.chartOptions = {
      series: [
        {
          name: "Faturamento",
          data: [1000, 1000, 1000, 1000, 1000, 1000, 1000, 1000, 1000, 1000, 1000, 1000],
        },
      ],
      chart: {
        height: 250,
        type: "bar",
        toolbar: {
          show: false,
        },
      },
      plotOptions: {
        bar: {
          columnWidth: "45%",
          distributed: false,
        },
      },
      dataLabels: {
        enabled: false,
      },
      colors: ["#2aaa21"],
      stroke: {
        width: 0,
      },
      grid: {
        show: false,
      },
      xaxis: {
        categories: [
          ["Seg", "00/00"],
          ["Ter", "00/00"],
          ["Qua", "00/00"],
          ["Qui", "00/00"],
          ["Sex", "00/00"],
          ["Sab", "00/00"],
          ["Dom", "00/00"],
          ["Seg", "00/00"],
          ["Ter", "00/00"],
          ["Qua", "00/00"],
          ["Qui", "00/00"],
          ["Sex", "00/00"],
        ],
        labels: {
          style: {
            fontSize: "12px",
          },
        },
      },
      yaxis: {
        labels: {
          show: false,
        },
      },
    }
  }
}
