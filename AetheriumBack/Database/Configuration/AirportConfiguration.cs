using AetheriumBack.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace AetheriumBack.Database.Configuration;

public class AirportConfiguration : IEntityTypeConfiguration<Airport>
{
    public void Configure(EntityTypeBuilder<Airport> builder)
    {
        builder.ToTable(nameof(Airport), "Aetherium");

        builder.HasKey(c => c.AirportCode);

        builder.Property(c => c.AirportName)
            .HasColumnName(nameof(Airport.AirportName))
            .HasMaxLength(255)
            .IsRequired();

        builder.Property(c => c.City)
            .HasColumnName(nameof(Airport.City))
            .HasMaxLength(100)
            .IsRequired();

        builder.Property(c => c.CountryCode)
            .HasColumnName(nameof(Airport.CountryCode))
            .HasMaxLength(10)
            .IsRequired();

        builder.Property(c => c.Latitude)
            .HasColumnName(nameof(Airport.Latitude))
            .IsRequired();

        builder.Property(c => c.Longitude)
            .HasColumnName(nameof(Airport.Longitude))
            .IsRequired();

        builder.Property(c => c.ElevationFeet)
            .HasColumnName(nameof(Airport.ElevationFeet))
            .IsRequired();

        builder.Property(c => c.RegionCode)
            .HasColumnName(nameof(Airport.RegionCode))
            .HasMaxLength(10)
            .IsRequired();
    }
}
