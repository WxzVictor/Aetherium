using AetheriumBack.Models;
using Microsoft.EntityFrameworkCore;

namespace AetheriumBack.Database;

public class AetheriumContext(DbContextOptions<AetheriumContext> options) : DbContext(options)
{
    public DbSet<Airport> Airports { get; set; }
    public DbSet<Flight> Flight { get; set; }
    //public DbSet<Hotel> Hotel { get; set; }
    //public DbSet<Offer> Offer { get; set; }
    //public DbSet<Reservation> Reservation { get; set; }
    //public DbSet<Seat> Seat { get; set; }
    //public DbSet<User> User { get; set; }
    //public DbSet<UserStat> UserStat { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.ApplyConfigurationsFromAssembly(GetType().Assembly);
    }
}
