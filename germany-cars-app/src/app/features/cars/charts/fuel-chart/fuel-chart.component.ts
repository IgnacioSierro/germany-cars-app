import { Component, input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgChartsModule } from 'ng2-charts';
import { ChartConfiguration, ChartData } from 'chart.js';
import { Car } from '../../car.interface';

@Component({
  selector: 'app-fuel-chart',
  standalone: true,
  imports: [CommonModule, NgChartsModule],
  templateUrl: './fuel-chart.component.html',
  styleUrls: ['./fuel-chart.component.scss'],
})
export class FuelChartComponent implements OnInit {
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
        '#FF9F40', // Orange
        '#C9CBCF', // Light Grey
        '#FFCD56', // Light Yellow
        '#4BC0C0', // Light Teal
        '#36A2EB', // Light Blue
        '#FF6384'  // Light Red
      ],
      hoverBackgroundColor: [
        '#FF6384',
        '#36A2EB',
        '#FFCE56',
        '#4BC0C0',
        '#9966FF',
        '#FF9F40',
        '#C9CBCF',
        '#FFCD56',
        '#4BC0C0',
        '#36A2EB',
        '#FF6384'
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
        text: 'Fuel Types Distribution',
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
      acc[car.fuel] = (acc[car.fuel] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const threshold = 5;
    const filteredFuelTypes = Object.entries(fuelTypes).filter(([key, value]) => value >= threshold);

    this.chartData.labels = filteredFuelTypes.map(([key]) => key);
    this.chartData.datasets[0].data = filteredFuelTypes.map(([, value]) => value);
  }
}