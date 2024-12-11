import { Injectable, signal, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Car } from './car.interface';
import { environment } from '../../../environment';

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
}