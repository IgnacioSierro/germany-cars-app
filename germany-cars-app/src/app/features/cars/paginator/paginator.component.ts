import { CommonModule } from '@angular/common';
import { Component, input, output } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-paginator',
  templateUrl: './paginator.component.html',
  styleUrls: ['./paginator.component.scss'],
  standalone: true,
  imports: [MatIconModule, CommonModule]
})
export class PaginatorComponent {
  currentPage = input.required<number>();
  totalPages = input.required<number>();

  previousPage = output<void>();
  nextPage = output<void>();

 
  onPreviousPage() {
    this.previousPage.emit();
  }

  onNextPage() {
    this.nextPage.emit();
  }
}
