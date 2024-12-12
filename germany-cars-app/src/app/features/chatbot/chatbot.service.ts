import { Injectable, WritableSignal, signal } from '@angular/core';

/**
 * Service responsible for managing chat interactions and car data analysis.
 * Provides methods for querying car statistics and managing chat responses.
 * Uses Angular signals for state management.
 */
@Injectable({
  providedIn: 'root'
})
export class ChatService {
  // Signals to store cars data and chat responses
  private carsSignal: WritableSignal<any[]> = signal([]);
  private responsesSignal: WritableSignal<{ question: string, answer: string }[]> = signal([]);

  /**
   * Updates the cars data in the service
   * @param cars - Array of car objects to store
   */
  setCars(cars: any[]) {
    this.carsSignal.set(cars);
  }

  /**
   * Retrieves the current cars data
   * @returns Array of car objects
   */
  getCars(): any[] {
    return this.carsSignal();
  }

  /**
   * Adds a new question-answer pair to the chat history
   * @param question - The user's question
   * @param answer - The generated answer
   */
  addResponse(question: string, answer: string) {
    this.responsesSignal.update(responses => [...responses, { question, answer }]);
  }

  /**
   * Retrieves the chat history
   * @returns Array of question-answer pairs
   */
  getResponses(): { question: string, answer: string }[] {
    return this.responsesSignal();
  }

  /**
   * Processes a user question and generates an appropriate answer
   * Supports questions about mileage, fuel type, transmission, and offers
   * @param question - The user's question
   */
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

  /**
   * Finds and formats information about the top 3 cars by mileage
   * @param cars - Array of car objects to analyze
   * @returns Formatted string with top 3 cars' details
   */
  private getTopMileageCars(cars: any[]): string {
    // Sort cars by mileage in descending order
    const sortedCars = [...cars].sort((a, b) => b.mileage - a.mileage);
    const top3 = sortedCars.slice(0, 3);
    return `Top 3 cars with highest mileage:\n` +
           top3.map((car, index) => 
             `${index + 1}. ${car.make} ${car.model}: ${car.mileage}km`
           ).join('\n');
  }

  /**
   * Analyzes cars with a specific fuel type
   * @param cars - Array of car objects to analyze
   * @param fuelType - Type of fuel to filter by
   * @returns Statistics about cars with specified fuel type
   */
  private getFuelTypeStats(cars: any[], fuelType: string): string {
    // Filter cars by fuel type and calculate average price
    const filteredCars = cars.filter(car => car.fuel === fuelType);
    const avgPrice = Math.round(filteredCars.reduce((sum, car) => sum + car.price, 0) / filteredCars.length);
    return `There are ${filteredCars.length} ${fuelType} cars.\n` +
           `Average price: €${avgPrice}`;
  }

  /**
   * Analyzes cars with a specific transmission type
   * @param cars - Array of car objects to analyze
   * @param gearType - Type of transmission to filter by
   * @returns Statistics about cars with specified transmission
   */
  private getTransmissionStats(cars: any[], gearType: string): string {
    // Filter by gear type and get unique makes
    const filteredCars = cars.filter(car => car.gear === gearType);
    const makes = [...new Set(filteredCars.map(car => car.make))];
    return `There are ${filteredCars.length} ${gearType} cars.\n` +
           `Available makes: ${makes.slice(0, 5).join(', ')}`;
  }

  /**
   * Analyzes cars that are marked as offers
   * @param cars - Array of car objects to analyze
   * @returns Statistics about cars on offer
   */
  private getOfferStats(cars: any[]): string {
    // Filter used cars and calculate price range
    const offers = cars.filter(car => car.offerType === 'Used');
    const priceRange = offers.reduce((acc, car) => ({
      min: Math.min(acc.min, car.price),
      max: Math.max(acc.max, car.price)
    }), { min: Infinity, max: -Infinity });
    
    return `There are ${offers.length} cars on offer.\n` +
           `Price range: €${priceRange.min} - €${priceRange.max}`;
  }
}