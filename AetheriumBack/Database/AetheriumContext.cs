using AetheriumBack.Models;
using Microsoft.EntityFrameworkCore;

namespace AetheriumBack.Database;

public class AetheriumContext : DbContext
{
    public DbSet<Airport> Airports { get; set; }
    public DbSet<Flight> Flight { get; set; }
    public DbSet<Hotel> Hotel { get; set; }
    public DbSet<Offer> Offer { get; set; }


}
