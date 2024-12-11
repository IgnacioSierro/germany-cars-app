namespace CarsApi.Models;

public class Car
{
    public int Id { get; set; }
    public int Mileage { get; set; }
    public string Make { get; set; } = string.Empty;
    public string Model { get; set; } = string.Empty;
    public string Fuel { get; set; } = string.Empty;
    public string Gear { get; set; } = string.Empty;
    public string OfferType { get; set; } = string.Empty;
    public decimal Price { get; set; }
    public int? Hp { get; set; }  // Make nullable
    public int Year { get; set; }
}