// Data/DataSeeder.cs
using System.Globalization;
using CsvHelper;
using CsvHelper.Configuration;
using CarsApi.Models;

namespace CarsApi.Data;

public class CarMap : ClassMap<Car>
{
    public CarMap()
    {
        Map(m => m.Mileage).Name("mileage");
        Map(m => m.Make).Name("make");
        Map(m => m.Model).Name("model");
        Map(m => m.Fuel).Name("fuel");
        Map(m => m.Gear).Name("gear");
        Map(m => m.OfferType).Name("offerType");
        Map(m => m.Price).Name("price");
        Map(m => m.Hp).Name("hp").Optional();
        Map(m => m.Year).Name("year");
    }
}

public static class DataSeeder
{
    public static async Task SeedData(CarDbContext context)
    {
        if (!context.Cars.Any())
        {
            var config = new CsvConfiguration(CultureInfo.InvariantCulture)
            {
                HeaderValidated = null,
                MissingFieldFound = null
            };

            using var reader = new StreamReader("Data/cars.csv");
            using var csv = new CsvReader(reader, config);
            csv.Context.RegisterClassMap<CarMap>();
            
            var cars = csv.GetRecords<Car>()
                .Select(car => {
                    if (!car.Hp.HasValue) car.Hp = 0;
                    return car;
                })
                .ToList();

            await context.Cars.AddRangeAsync(cars);
            await context.SaveChangesAsync();
        }
    }
}