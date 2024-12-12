import { Injectable, signal, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Car } from './car.interface';
import { environment } from '../../../environment';
import { Filters } from './search-form/filters.interface';

/**
 * Service responsible for handling all car-related API calls and state management.
 * Uses Angular's HttpClient for API communication and signals for state management.
 */
@Injectable({
    providedIn: 'root'
})
export class CarService {
    // Base URL for car-related endpoints
    private apiUrl = `${environment.apiUrl}/cars`;
    
    // Global state for cars using Angular's signals
    cars = signal<Car[]>([]);
    
    // Inject HttpClient for API calls
    private readonly _http = inject(HttpClient);

    /**
     * Fetches all cars from the backend and updates the global cars signal.
     * Uses GET /api/cars endpoint.
     */
    fetchCars(): void {
        this._http.get<Car[]>(this.apiUrl)
            .subscribe({
                next: (response) => {
                    // Update global state with fetched cars
                    this.cars.set(response);
                },
                error: (error) => {
                    console.error('Error fetching cars:', error);
                }
            });
    }

    /**
     * Searches cars based on provided filters.
     * @param filters - Object containing search criteria (make, model, price range, year)
     * @returns Observable of filtered cars array
     */
    searchCars(filters: Filters) {
        // Build query parameters from filters, handling empty values
        const params = new HttpParams()
            .set('make', filters.make || '')
            .set('model', filters.model || '')
            .set('minPrice', filters.minPrice?.toString() || '')
            .set('maxPrice', filters.maxPrice?.toString() || '')
            .set('minYear', filters.minYear?.toString() || '');

        return this._http.get<Car[]>(`${this.apiUrl}/search`, { params });
    }

    /**
     * Retrieves quick statistics for a specific car make.
     * @param make - The car manufacturer name
     * @returns Observable of statistics including average price, popular models, etc.
     */
    getQuickStats(make: string) {
        return this._http.get<any>(`${this.apiUrl}/quick-stats/${make}`);
    }
}