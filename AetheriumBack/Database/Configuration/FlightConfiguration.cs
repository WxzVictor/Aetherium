using AetheriumBack.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace AetheriumBack.Database.Configuration;

public class FlightConfiguration : IEntityTypeConfiguration<Flight>
{

    public void Configure(EntityTypeBuilder<Flight> builder)
    {
        builder.ToTable(nameof(Flight), "Aetherium");

        builder.HasKey(c => c.FlightId);

        builder.Property(c => c.AirlineName)
            .HasColumnName(nameof(Flight.AirlineName))
            .HasMaxLength(100)
            .IsRequired();

        builder.Property(c => c.FlightCode)
            .HasColumnName(nameof(Flight.FlightCode))
            .HasMaxLength(10)
            .IsRequired();

        builder.Property(c => c.DepartureAirportCode)
            .HasColumnName(nameof(Flight.DepartureAirportCode))
            .HasMaxLength(10)
            .IsRequired();

        builder.Property(c => c.ArrivalAirportCode)
            .HasColumnName(nameof(Flight.ArrivalAirportCode))
            .HasMaxLength(10)
            .IsRequired();

        builder.Property(c => c.DepartureTime)
            .HasColumnName(nameof(Flight.DepartureTime))
            .IsRequired();

        builder.Property(c => c.ArrivalTime)
            .HasColumnName(nameof(Flight.ArrivalTime))
            .IsRequired();

        builder.Property(c => c.DurationMinutes)
            .HasColumnName(nameof(Flight.DurationMinutes))
            .IsRequired();

        builder.Property(c => c.Price)
            .HasColumnName(nameof(Flight.Price))
            .IsRequired();

        builder.HasOne(f => f.ArrivalAirport)
            .WithMany(c => c.ArrivingFlights)
            .HasForeignKey(f => f.ArrivalAirportCode)
            .OnDelete(DeleteBehavior.NoAction);

        builder.HasOne(f => f.DepartureAirport)
            .WithMany(c => c.DepartingFlights)
            .HasForeignKey(f => f.DepartureAirportCode)
            .OnDelete(DeleteBehavior.NoAction);
    }
}
