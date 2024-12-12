import { CommonModule } from "@angular/common";
import { Component, output } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { Filters } from "./filters.interface";

@Component({
  selector: 'app-search-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './search-form.component.html',
  styleUrl: './search-form.component.scss'
})
export class SearchFormComponent {
  search = output<{}>();

  filters: Filters = {
    make: '',
    model: '',
    minPrice: null,
    maxPrice: null,
    minYear: null
  };

  onSearch() {
    this.search.emit(this.filters);
  }

  clearFilters() {
    this.filters = {
      make: '',
      model: '',
      minPrice: null,
      maxPrice: null,
      minYear: null
    };
    this.search.emit(this.filters);
  }
}