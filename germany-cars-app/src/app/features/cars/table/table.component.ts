import { Component, OnInit, inject, signal, effect, Injector, runInInjectionContext, model, input } from '@angular/core';
import { CommonModule } from '@angular/common';
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
  imports: [CommonModule, MatTableModule, MatProgressSpinnerModule, MatIconModule, PaginatorComponent],
})
export class TableComponent implements OnInit {
  private readonly injector = inject(Injector);

  cars = input.required<Car[]>();
  pageSize = input.required<number>();
  displayedColumns = input.required<string[]>();
  currentPage = model.required<number>();
  totalPages = signal<number>(0);
  pagedData = signal<Car[]>([]);

  constructor() {
    runInInjectionContext(this.injector, () => {
      effect(() => {
        this.totalPages.set(Math.ceil(this.cars().length / this.pageSize()));
        this.updatePagedData();
      });
    });
  }

  ngOnInit(): void {
    this.updatePagedData();
  }


  previousPage() {
    if (this.currentPage() > 0) {
      this.currentPage.set(this.currentPage() - 1);
      this.updatePagedData();
    }
  }

  nextPage() {
    if (this.currentPage() < this.totalPages() - 1) {
      this.currentPage.set(this.currentPage() + 1);
      this.updatePagedData();
    }
  }

  updatePagedData() {
    const start = this.currentPage() * this.pageSize();
    const end = start + this.pageSize();
    this.pagedData.set(this.cars().slice(start, end));
  }
}