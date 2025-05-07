import { Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { NgApexchartsModule } from 'ng-apexcharts';
import { DashboardCardComponent, DashbocardInfos } from './components/dashboard-card/dashboard-card.component';
import { DashboardBuyedTicketsComponent } from './components/dashboard-buyed-tickets/dashboard-buyed-tickets.component';
import { PageHeaderComponent } from '../../../shared/components/page-header/page-header.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
  imports: [
    DashboardCardComponent,
    MatCardModule,
    DashboardBuyedTicketsComponent,
    NgApexchartsModule,
    PageHeaderComponent,
  ],
})
export class DashboardComponent {
  public title = 'Dashboard';
  public pageSession = 'Dashboard';

  public infos: DashbocardInfos[] = [
    {
      value: 'R$ 3.000.000,00',
      description: 'Faturamento Ingressos',
      percentage: '+50.2%',
      icon: 'paid',
      color: '#294153',
    },
    {
      value: '83.706',
      description: 'Faturamento Planos',
      percentage: '+30.8%',
      icon: 'person',
      color: '#FBBB01',
    },
    {
      value: '981.657',
      description: 'Usuários',
      percentage: '+76.4%',
      icon: 'task',
      color: '#EC6C6D',
    },
  ];

  public pieChart: any = {
    colors: ['#6485BC', '#0969E6', '#1B2E4E', '#3F67A9', '#284980'],
    series: [44, 55, 13, 43, 22],
    chart: {
      type: 'pie',
    },
    legend: {
      show: false,
    },
  };

  public barChart: any = {
    series: [
      {
        name: 'Novos Usuários',
        data: [50, 44, 55, 57, 56, 61, 58],
        color: '#FBBB01',
      },
      {
        name: 'Vendas',
        data: [79, 76, 85, 101, 98, 87, 105],
        color: '#294153',
      },

    ],
    chart: {
      type: 'bar',
      height: 350,
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: '55%',
      },
    },
    dataLabels: {
      enabled: false,
    },
    stroke: {
      show: true,
      width: 2,
      colors: ['transparent'],
    },
    xaxis: {
      categories: [
        'Seg',
        'Ter',
        'Qua',
        'Qui',
        'Sex',
        'Sab',
        'Dom',
      ],
    },
    yaxis: {
      title: {
        text: '$ (thousands)',
      },
    },
    fill: {
      opacity: 1,
    },
    tooltip: {
      y: {
        formatter: function(val: any) {
          return '$ ' + val + ' thousands';
        },
      },
    },
  };
}
