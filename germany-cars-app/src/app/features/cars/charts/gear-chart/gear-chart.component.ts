import { Component, input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgChartsModule } from 'ng2-charts';
import { ChartConfiguration, ChartData } from 'chart.js';
import { Car } from '../../car.interface';

@Component({
  selector: 'app-gear-chart',
  standalone: true,
  imports: [CommonModule, NgChartsModule],
  templateUrl: './gear-chart.component.html',
  styleUrls: ['./gear-chart.component.scss'],
})
export class GearChartComponent implements OnInit {
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
      ],
      hoverBackgroundColor: [
        '#FF6384', // Red
        '#36A2EB', // Blue
        '#FFCE56', // Yellow
        '#4BC0C0', // Teal
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
        text: 'Gear Types Distribution',
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
    const gearTypes = this.cars().reduce((acc, car) => {
      const gearType = car.gear || 'Other'; // Replace empty labels with 'Other'
      acc[gearType] = (acc[gearType] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    this.chartData.labels = Object.keys(gearTypes);
    this.chartData.datasets[0].data = Object.values(gearTypes);
  }
}