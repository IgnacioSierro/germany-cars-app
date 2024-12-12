import { Injectable, signal, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Car } from './car.interface';
import { environment } from '../../../environment';
import { Filters } from './search-form/filters.interface';

@Injectable({
    providedIn: 'root'
})
export class CarService {
    private apiUrl = `${environment.apiUrl}/cars`;
    cars = signal<Car[]>([]);
    private readonly _http = inject(HttpClient);

    fetchCars(): void {
        this._http.get<Car[]>(this.apiUrl)
            .subscribe({
                next: (response) => {
                    this.cars.set(response);
                },
                error: (error) => {
                    console.error('Error fetching cars:', error);
                }
            });
    }

    searchCars(filters: Filters) {
        const params = new HttpParams()
            .set('make', filters.make || '')
            .set('model', filters.model || '')
            .set('minPrice', filters.minPrice?.toString() || '')
            .set('maxPrice', filters.maxPrice?.toString() || '')
            .set('minYear', filters.minYear?.toString() || '');

        return this._http.get<Car[]>(`${this.apiUrl}/search`, { params });
    }

    getQuickStats(make: string) {
        return this._http.get<any>(`${this.apiUrl}/quick-stats/${make}`);
    }
}