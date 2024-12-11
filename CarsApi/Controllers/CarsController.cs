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
}