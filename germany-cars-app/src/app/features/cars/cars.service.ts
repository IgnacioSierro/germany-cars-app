import { Injectable, signal, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Car } from './car.interface';

@Injectable({
    providedIn: 'root'
})
export class CarService {
    private apiUrl = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vToTArlYyW3keFL7jRGg1KeOPjzv7NVtNsxuhQqwKXKCmGGpsy3Tk7-McpS_PMAK_XWCPCPoGa2EwxN/pub?output=csv';
    cars = signal<Car[]>([]);
    private readonly _http = inject(HttpClient);

    fetchCars(): void {
        this._http.get(this.apiUrl, { responseType: 'text' }).subscribe(response => {
            const cars: Car[] = [];
            const lines = response.split('\n');
            const headers = lines[0].split(',');

            // Limitar a los primeros 10 elementos
            const limit = Math.min(100, lines.length - 1);

            for (let i = 1; i <= lines.length - 1; i++) {
                const data = lines[i].split(',');
                if (data.length === headers.length) {
                    const car: Car = {
                        mileage: +data[headers.indexOf('mileage')],
                        make: data[headers.indexOf('make')],
                        model: data[headers.indexOf('model')],
                        fuel: data[headers.indexOf('fuel')],
                        gear: data[headers.indexOf('gear')],
                        offertype: data[headers.indexOf('offerType')],
                        price: +data[headers.indexOf('price')]
                    };
                    cars.push(car);
                }
            }
            this.cars.set(cars);
        });
    }
}
