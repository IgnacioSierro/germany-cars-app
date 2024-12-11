// Data/CarDbContext.cs
using Microsoft.EntityFrameworkCore;
using CarsApi.Models;
using Microsoft.EntityFrameworkCore.Diagnostics;

namespace CarsApi.Data;

public class CarDbContext : DbContext
{
    public CarDbContext(DbContextOptions<CarDbContext> options) : base(options) { }
    
    public DbSet<Car> Cars { get; set; } = null!;

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Car>(entity =>
        {
            entity.HasKey(e => e.Id);
            
            entity.Property(e => e.Price)
                .HasColumnType("decimal(10,2)");
                
            entity.Property(e => e.Make)
                .HasMaxLength(100)
                .IsRequired();
                
            entity.Property(e => e.Model)
                .HasMaxLength(100)
                .IsRequired();
                
            entity.Property(e => e.Fuel)
                .HasMaxLength(50);
                
            entity.Property(e => e.Gear)
                .HasMaxLength(50);
                
            entity.Property(e => e.OfferType)
                .HasMaxLength(50);
        });
    }

    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
    {
        optionsBuilder.ConfigureWarnings(warnings =>
            warnings.Ignore(RelationalEventId.PendingModelChangesWarning));
    }
}