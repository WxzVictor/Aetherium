using AetheriumBack.Models;
using Microsoft.EntityFrameworkCore;

namespace AetheriumBack.Database.Configuration;

public class HotelConfiguration : IEntityTypeConfiguration<Hotel>
{
    public void Configure(Microsoft.EntityFrameworkCore.Metadata.Builders.EntityTypeBuilder<Hotel> builder)
    {
        builder.ToTable(nameof(Hotel), "Aetherium");

        builder.HasKey(c => c.HotelId);

        builder.Property(c => c.HotelName)
            .HasColumnName(nameof(Hotel.HotelName))
            .HasMaxLength(255)
            .IsRequired();

        builder.Property(c => c.Address)
            .HasColumnName(nameof(Hotel.Address))
            .HasMaxLength(255)
            .IsRequired();

        builder.Property(c => c.Rating)
            .HasColumnName(nameof(Hotel.Rating))
            .IsRequired();

        builder.Property(c => c.ContactNumber)
            .HasColumnName(nameof(Hotel.ContactNumber))
            .HasMaxLength(50)
            .IsRequired();

        builder.Property(c => c.PricePerNight)
            .HasColumnName(nameof(Hotel.PricePerNight))
            .IsRequired();

        builder.Property(c => c.City)
            .HasColumnName(nameof(Hotel.City))
            .HasMaxLength(50)
            .IsRequired();

        builder.Property(c => c.Country)
            .HasColumnName(nameof(Hotel.Country))
            .HasMaxLength(150)
            .IsRequired();

        builder.Property(c => c.Email)
            .HasColumnName(nameof(Hotel.Email))
            .HasMaxLength(100)
            .IsRequired();

        builder.Property(c => c.CheckInTime)
            .HasColumnName(nameof(Hotel.CheckInTime))
            .IsRequired();

        builder.Property(c => c.CheckOutTime)
            .HasColumnName(nameof(Hotel.CheckOutTime))
            .IsRequired();
    }
}
