import { Injectable, WritableSignal, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  private carsSignal: WritableSignal<any[]> = signal([]);
  private responsesSignal: WritableSignal<{ question: string, answer: string }[]> = signal([]);

  setCars(cars: any[]) {
    this.carsSignal.set(cars);
  }

  getCars(): any[] {
    return this.carsSignal();
  }

  addResponse(question: string, answer: string) {
    this.responsesSignal.update(responses => [...responses, { question, answer }]);
  }

  getResponses(): { question: string, answer: string }[] {
    return this.responsesSignal();
  }

  askQuestion(question: string) {
    let answer = '';
    const cars = this.getCars();

    switch (question) {
      case 'Which car has the highest mileage?':
        answer = this.getTopMileageCars(cars);
        break;
      case 'Which cars use gasoline?':
        answer = this.getFuelTypeStats(cars, 'Gasoline');
        break;
      case 'Which cars are automatic?':
        answer = this.getTransmissionStats(cars, 'Automatic');
        break;
      case 'Which cars are on offer?':
        answer = this.getOfferStats(cars);
        break;
      default:
        answer = 'Question not recognized.';
    }

    this.addResponse(question, answer);
  }

  private getTopMileageCars(cars: any[]): string {
    const sortedCars = [...cars].sort((a, b) => b.mileage - a.mileage);
    const top3 = sortedCars.slice(0, 3);
    return `Top 3 cars with highest mileage:\n` +
           top3.map((car, index) => 
             `${index + 1}. ${car.make} ${car.model}: ${car.mileage}km`
           ).join('\n');
  }

  private getFuelTypeStats(cars: any[], fuelType: string): string {
    const filteredCars = cars.filter(car => car.fuel === fuelType);
    const avgPrice = Math.round(filteredCars.reduce((sum, car) => sum + car.price, 0) / filteredCars.length);
    return `There are ${filteredCars.length} ${fuelType} cars.\n` +
           `Average price: €${avgPrice}`;
  }

  private getTransmissionStats(cars: any[], gearType: string): string {
    const filteredCars = cars.filter(car => car.gear === gearType);
    const makes = [...new Set(filteredCars.map(car => car.make))];
    return `There are ${filteredCars.length} ${gearType} cars.\n` +
           `Available makes: ${makes.slice(0, 5).join(', ')}`;
  }

  private getOfferStats(cars: any[]): string {
    const offers = cars.filter(car => car.offerType === 'Used');
    const priceRange = offers.reduce((acc, car) => ({
      min: Math.min(acc.min, car.price),
      max: Math.max(acc.max, car.price)
    }), { min: Infinity, max: -Infinity });
    
    return `There are ${offers.length} cars on offer.\n` +
           `Price range: €${priceRange.min} - €${priceRange.max}`;
  }
}