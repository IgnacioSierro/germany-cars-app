import { Component, OnInit, inject, signal, effect, Injector, runInInjectionContext, model, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';
import { Car } from '../car.interface';
import { PaginatorComponent } from '../paginator/paginator.component';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, MatTableModule, MatProgressSpinnerModule, MatIconModule, PaginatorComponent],
})
export class TableComponent implements OnInit {
  private readonly injector = inject(Injector);
  cars = input.required<Car[]>(); // Input for the list of cars
  pageSize = input.required<number>(); // Input for the page size
  displayedColumns = input.required<string[]>(); // Input for the displayed columns
  currentPage = model.required<number>(); // Model for the current page
  totalPages = signal<number>(0); // Signal for the total number of pages
  pagedData = signal<Car[]>([]); // Signal for the paginated data
  filters = {
    make: '',
    fuel: '',
    gear: '',
    offertype: ''
  }; // Object to hold filter values
  filterOptions = {
    makes: [] as string[],
    fuels: [] as string[],
    gears: [] as string[],
    offerTypes: [] as string[]
  }; // Object to hold filter options

  constructor() {
    // Run the effect in the injection context
    runInInjectionContext(this.injector, () => {
      effect(() => {
        // Calculate the total number of pages based on the filtered data
        const filteredCars = this.applyFilters();
        this.totalPages.set(Math.ceil(filteredCars.length / this.pageSize()));
        // Update the paginated data
        this.updatePagedData(filteredCars);
      });
    });
  }

  ngOnInit(): void {
    // Initialize the paginated data and populate filter options
    this.updatePagedData(this.applyFilters());
    this.populateFilterOptions();
  }

  previousPage() {
    // Navigate to the previous page if not on the first page
    if (this.currentPage() > 0) {
      this.currentPage.set(this.currentPage() - 1);
      this.updatePagedData(this.applyFilters());
    }
  }

  nextPage() {
    // Navigate to the next page if not on the last page
    if (this.currentPage() < this.totalPages() - 1) {
      this.currentPage.set(this.currentPage() + 1);
      this.updatePagedData(this.applyFilters());
    }
  }

  updatePagedData(filteredCars: Car[]) {
    // Paginate the data
    const start = this.currentPage() * this.pageSize();
    const end = start + this.pageSize();
    this.pagedData.set(filteredCars.slice(start, end));
  }

  applyFilters() {
    // Filter the cars based on the selected filter values
    return this.cars().filter(car => {
      return (!this.filters.make || car.make === this.filters.make) &&
        (!this.filters.fuel || car.fuel === this.filters.fuel) &&
        (!this.filters.gear || car.gear === this.filters.gear) &&
        (!this.filters.offertype || car.offertype === this.filters.offertype);
    });
  }

  populateFilterOptions() {
    // Populate filter options based on the available data
    const makes = new Set<string>();
    const fuels = new Set<string>();
    const gears = new Set<string>();
    const offerTypes = new Set<string>();

    this.cars().forEach(car => {
      makes.add(car.make);
      fuels.add(car.fuel);
      gears.add(car.gear);
      offerTypes.add(car.offertype);
    });

    this.filterOptions.makes = Array.from(makes);
    this.filterOptions.fuels = Array.from(fuels);
    this.filterOptions.gears = Array.from(gears);
    this.filterOptions.offerTypes = Array.from(offerTypes);
  }

  onFilterChange() {
    // Reset to the first page and update the paginated data when a filter changes
    this.currentPage.set(0);
    const filteredCars = this.applyFilters();
    this.totalPages.set(Math.ceil(filteredCars.length / this.pageSize()));
    this.updatePagedData(filteredCars);
  }
}