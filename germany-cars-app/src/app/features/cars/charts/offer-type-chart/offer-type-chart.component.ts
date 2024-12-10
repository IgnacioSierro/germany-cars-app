import { Component, input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgChartsModule } from 'ng2-charts';
import { ChartConfiguration, ChartData } from 'chart.js';
import { Car } from '../../car.interface';

@Component({
  selector: 'app-offer-type-chart',
  standalone: true,
  imports: [CommonModule, NgChartsModule],
  templateUrl: './offer-type-chart.component.html',
  styleUrls: ['./offer-type-chart.component.scss'],
})
export class OfferTypeChartComponent implements OnInit {
  cars = input.required<Car[]>();

  chartData: ChartData<'pie'> = {
    labels: [],
    datasets: [{
      data: [],
      backgroundColor: [
        '#FF6384', // Red
        '#36A2EB', // Blue
        '#FFCE56', // Yellow
        '#4BC0C0', // Teal
        '#9966FF', // Purple
      ],
      hoverBackgroundColor: [
        '#FF6384',
        '#36A2EB',
        '#FFCE56',
        '#4BC0C0',
        '#9966FF',
      ]
    }]
  };

  chartOptions: ChartConfiguration['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'right',
        labels: {
          font: {
            size: 14
          }
        }
      },
      title: {
        display: true,
        text: 'Offer Types Distribution',
        font: {
          size: 16,
          weight: 'bold'
        }
      },
      tooltip: {
        enabled: true
      }
    },
    animation: {
      duration: 1000,
      easing: 'easeOutBounce'
    }
  };

  ngOnInit() {
    this.processChartData();
  }

  private processChartData() {
    const fuelTypes = this.cars().reduce((acc, car) => {
      acc[car.offertype] = (acc[car.offertype] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    this.chartData.labels = Object.keys(fuelTypes);
    this.chartData.datasets[0].data = Object.values(fuelTypes);
  }
}