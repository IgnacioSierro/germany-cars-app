import { Component, OnInit, inject, signal, effect, Injector, runInInjectionContext } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { CarService } from './cars.service';
import { Car } from './car.interface';
import { TableComponent } from "./table/table.component";
import { SpinnerComponent } from '../../shared/ui/spinner/spinner.component';

@Component({
  selector: 'app-car-list',
  templateUrl: './car-list.component.html',
  styleUrls: ['./car-list.component.scss'],
  standalone: true,
  imports: [CommonModule, MatProgressSpinnerModule, TableComponent, SpinnerComponent],
  providers: [CarService]
})
export class CarListComponent implements OnInit {
  private readonly _carService = inject(CarService);
  private readonly injector = inject(Injector);
  displayedColumns= signal<string[]>(['make', 'model', 'mileage', 'fuel', 'gear', 'offertype', 'price']);
  cars = signal<Car[]>([]);
  pageSize = signal<number>(10);
  currentPage = signal<number>(0);

  constructor() {
    runInInjectionContext(this.injector, () => {
      effect(() => {
        const cars = this._carService.cars();
        this.cars.set(cars);
      });
    });
  }

  ngOnInit(): void {
    this._carService.fetchCars();
  }
}