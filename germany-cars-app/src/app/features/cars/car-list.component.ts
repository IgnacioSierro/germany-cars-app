import { Component, OnInit, inject, signal, effect, Injector, runInInjectionContext } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { CarService } from './cars.service';
import { Car } from './car.interface';
import { TableComponent } from "./table/table.component";
import { SpinnerComponent } from '../../shared/ui/spinner/spinner.component';
import { FuelChartComponent } from './charts/fuel-chart/fuel-chart.component';
import { GearChartComponent } from './charts/gear-chart/gear-chart.component';
import { OfferTypeChartComponent } from './charts/offer-type-chart/offer-type-chart.component';
import { ChatbotComponent } from '../chatbot/chatbot.component';
import { SearchFormComponent } from './search-form/search-form.component';
import { firstValueFrom } from 'rxjs';
import { Filters } from './search-form/filters.interface';

@Component({
  selector: 'app-car-list',
  templateUrl: './car-list.component.html',
  styleUrls: ['./car-list.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    MatProgressSpinnerModule,
    TableComponent,
    SpinnerComponent,
    FuelChartComponent,
    GearChartComponent,
    OfferTypeChartComponent,
    ChatbotComponent,
    SearchFormComponent
  ],
  providers: [CarService]
})
export class CarListComponent implements OnInit {
  private readonly _carService = inject(CarService);
  private readonly injector = inject(Injector);
  displayedColumns = signal<string[]>(['make', 'model', 'mileage', 'fuel', 'gear', 'offertype', 'price']);
  cars = signal<Car[]>([]);
  pageSize = signal<number>(7);
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

  async onSearch(filters: Filters) {
    const results = await firstValueFrom(this._carService.searchCars(filters));
    this.cars.set(results);
  }
}
