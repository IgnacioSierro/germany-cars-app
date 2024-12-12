import { Component, inject, input, output, signal, OnChanges } from "@angular/core";
import { CarService } from "../cars.service";
import { firstValueFrom } from "rxjs";
import { CarStats } from "./car-stats.interface";

@Component({
  selector: 'app-quick-stats',
  templateUrl: './quick-stats.component.html',
  styleUrl: './quick-stats.component.scss',
})
export class QuickStatsComponent implements OnChanges {
  make = input<string | null>();
  closeEvent = output<void>();
  stats = signal<CarStats | null>(null);
  private readonly _carService = inject(CarService);

  ngOnInit() {
    this.loadStats();
  }

  ngOnChanges() {
    this.loadStats();
  }

  async loadStats() {
    const make = this.make() ?? '';
    const stats = await firstValueFrom(this._carService.getQuickStats(make));
    this.stats.set(stats);
  }

  close() {
    this.closeEvent.emit();
  }
}