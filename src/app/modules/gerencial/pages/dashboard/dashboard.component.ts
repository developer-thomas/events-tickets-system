import { AfterViewInit, ChangeDetectorRef, Component, inject, OnInit, signal } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { NgApexchartsModule } from 'ng-apexcharts';
import { DashboardCardComponent } from './components/dashboard-card/dashboard-card.component';
import { DashboardBuyedTicketsComponent } from './components/dashboard-buyed-tickets/dashboard-buyed-tickets.component';
import { PageHeaderComponent } from '../../../shared/components/page-header/page-header.component';
import { DashboardData, DashbocardInfos, TicketsSold } from './models/Dashboard.interface';
import { DashboardService } from './dashboard.service';

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
export class DashboardComponent implements AfterViewInit {
  private dashboardService = inject(DashboardService);
  private cdr = inject(ChangeDetectorRef)

  public title = 'Dashboard';
  public pageSession = 'Dashboard';

  public ticketsSold = signal<TicketsSold[]>([]);

  // ngOnInit(): void {
  //   this.getDashboardData();
  // }

  ngAfterViewInit(): void {
    this.getDashboardData();
  }

  getDashboardData() {
    this.dashboardService.getDashboard().subscribe({
      next: (res) => {
        this.populateDashboardCard(res);
        this.ticketsSold.set(res.lastTicketsSold);
        this.populateBarChart(res);
        this.populatePieChart(res);
        this.cdr.detectChanges();
      }
    });
  }

  // Popula os valores dos cards com a resposta da api
  public populateDashboardCard(res: any) {
    this.dashboardCardData = this.dashboardCardData.map((info) => {
      switch (info.description) {
        case 'Faturamento Ingressos':
          return { ...info, value: this.formatCurrency(res.ticketsRevenue) };
        case 'Faturamento Planos':
          return { ...info, value: this.formatCurrency(res.subscritionsRevenue) };
        case 'Usuários':
          return { ...info, value: res.users.toLocaleString() };
        default:
          return info;
      }
    });    
  }

  // Informações que devem conter no card
  public dashboardCardData: DashbocardInfos[] = [
    {
      value: '0',
      description: 'Faturamento Ingressos',
      icon: 'paid',
      color: '#294153',
    },
    {
      value: '0',
      description: 'Faturamento Planos',
      icon: 'person',
      color: '#FBBB01',
    },
    {
      value: '0',
      description: 'Usuários',
      icon: 'task',
      color: '#EC6C6D',
    },
  ];

  populatePieChart(res: any) {
    const categoriesData = res.categoriesRevenue;
    const locationsData = res.locationsRevenue;

    this.pieChartCategories = {
      ...this.pieChartCategories,
      series: categoriesData.map((cat: any) => cat.revenue),
      labels: categoriesData.map((cat: any) => cat.name)
    };

    this.pieChartPlaces = {
      ...this.pieChartPlaces,
      series: locationsData.map((loc: any) => loc.total),
      labels: locationsData.map((loc: any) => loc.name)
    };
  }

  public pieChartCategories: any = {
    colors: ['#6485BC', '#0969E6', '#1B2E4E', '#3F67A9', '#284980'],
    series: [],
    chart: {
      type: 'pie',
      height: 350
    },
    legend: {
      position: 'bottom',
      horizontalAlign: 'center'
    },
    labels: [],
    responsive: [{
      breakpoint: 480,
      options: {
        chart: {
          width: 200
        },
        legend: {
          position: 'bottom'
        }
      }
    }]
  };

  public pieChartPlaces: any = {
    colors: ['#6485BC', '#0969E6', '#1B2E4E', '#3F67A9', '#284980'],
    series: [],
    chart: {
      type: 'pie',
      height: 350
    },
    legend: {
      position: 'bottom',
      horizontalAlign: 'center'
    },
    labels: [],
    responsive: [{
      breakpoint: 480,
      options: {
        chart: {
          width: 200
        },
        legend: {
          position: 'bottom'
        }
      }
    }]
  };


  populateBarChart(res: any) {
    const annualData = res.annualInformation;
    const cleanedAnnualData = annualData.slice(0, 12);

    this.barChart = {
      ...this.barChart,
      series: [
        {
          name: 'Usuários',
          data: cleanedAnnualData.map((item: any) => item.totalUsers)
        },
        {
          name: 'Faturamento',
          data: cleanedAnnualData.map((item: any) => item.ticketsRevenue)
        }
      ],
      xaxis: {
        ...this.barChart.xaxis,
        categories: cleanedAnnualData.map((item: any) => item.month)
      }
    };
  }

  public barChart: any = {
    series: [
      {
        name: 'Usuários',
        data: []
      },
      {
        name: 'Faturamento',
        data: []
      }
    ],
    chart: {
      type: 'bar',
      height: 350,
      stacked: false,
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: '55%',
        endingShape: 'rounded'
      },
    },
    dataLabels: {
      enabled: false
    },
    stroke: {
      show: true,
      width: 2,
      colors: ['transparent']
    },
    xaxis: {
      categories: [],
    },
    yaxis: [
      {
        title: {
          text: 'Usuários'
        }
      },
      {
        opposite: true,
        title: {
          text: 'Faturamento'
        }
      }
    ],
    fill: {
      opacity: 1
    },
    tooltip: {
      y: {
        formatter: function (val: any) {
          return val
        }
      }
    },
    legend: {
      position: 'top',
      horizontalAlign: 'left',
    }
  };

  formatCurrency(value: number): string {
    return value.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      minimumFractionDigits: 2
    });
  }
}
