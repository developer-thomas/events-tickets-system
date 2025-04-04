import { CommonModule } from '@angular/common';
import { Component, ViewChild } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { ApexAxisChartSeries, ApexChart, ApexDataLabels, ApexPlotOptions, ApexXAxis, ApexYAxis, ApexStroke, ApexGrid, ApexTooltip, ChartComponent, NgApexchartsModule } from 'ng-apexcharts';

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
  tooltip: ApexTooltip
}

interface MetricCard {
  value: string
  label: string
  percentage: string
  isPositive: boolean
  iconBgColor: string
}

interface RecentPurchase {
  eventTitle: string
  userName: string
  quantity: number
  status: string
  price: string
}

@Component({
  selector: 'app-dashboard-view',
  standalone: true,
  imports: [CommonModule, MatIconModule, MatCardModule, NgApexchartsModule],
  templateUrl: './dashboard-view.component.html',
  styleUrl: './dashboard-view.component.scss'
})
export class DashboardViewComponent {
  @ViewChild("chart") chart!: ChartComponent
  public chartOptions!: Partial<ChartOptions>

  metricCards: MetricCard[] = [
    {
      value: "R$ 3.000.000,00",
      label: "Faturamento",
      percentage: "50,2%",
      isPositive: true,
      iconBgColor: "#2aaa21",
    },
    {
      value: "83.706",
      label: "Ingressos vendidos",
      percentage: "50,2%",
      isPositive: false,
      iconBgColor: "#192554",
    },
    {
      value: "83.706",
      label: "Total de ingressos",
      percentage: "50,2%",
      isPositive: false,
      iconBgColor: "#ffc87f",
    },
  ]

  recentPurchases: RecentPurchase[] = [
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
        show: true,
        borderColor: "#f5f5f5",
        strokeDashArray: 0,
        position: "back",
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
          show: true,
          formatter: (val) => val.toFixed(0),
        },
      },
      tooltip: {
        y: {
          formatter: (val) => "R$ " + val.toFixed(2),
        },
      },
    }
  }
}
