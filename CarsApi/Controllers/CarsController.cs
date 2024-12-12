using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using CarsApi.Data;
using CarsApi.Models;

namespace CarsApi.Controllers;

// Controllers/CarsController.cs
[ApiController]
[Route("api/[controller]")]
public class CarsController : ControllerBase
{
    private readonly CarDbContext _context;

    public CarsController(CarDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<Car>>> GetCars()
    {
        return await _context.Cars
            .AsNoTracking()
            .ToListAsync();
    }

    [HttpGet("search")]
    public async Task<ActionResult<IEnumerable<Car>>> SearchCars(
    [FromQuery] string? make,
    [FromQuery] string? model,
    [FromQuery] decimal? minPrice,
    [FromQuery] decimal? maxPrice,
    [FromQuery] int? minYear)
    {
        var query = _context.Cars.AsQueryable();

        if (!string.IsNullOrEmpty(make))
            query = query.Where(c => c.Make.Contains(make));
        if (!string.IsNullOrEmpty(model))
            query = query.Where(c => c.Model.Contains(model));
        if (minPrice.HasValue)
            query = query.Where(c => c.Price >= minPrice);
        if (maxPrice.HasValue)
            query = query.Where(c => c.Price <= maxPrice);
        if (minYear.HasValue)
            query = query.Where(c => c.Year >= minYear);

        return await query.ToListAsync();
    }

    [HttpGet("quick-stats/{make}")]
    public async Task<ActionResult<object>> GetQuickStats(string make)
    {
        var stats = await _context.Cars
            .Where(c => c.Make == make)
            .GroupBy(c => c.Make)
            .Select(g => new
            {
                AveragePrice = (int) g.Average(c => c.Price),
                LowestPrice = g.Min(c => c.Price),
                HighestPrice = g.Max(c => c.Price),
                TotalModels = g.Select(c => c.Model).Distinct().Count(),
                PopularFuelType = g.GroupBy(c => c.Fuel)
                                 .OrderByDescending(x => x.Count())
                                 .First().Key
            })
            .FirstOrDefaultAsync();

        if (stats == null)
        {
            return NotFound();
        }

        return stats;
    }
}