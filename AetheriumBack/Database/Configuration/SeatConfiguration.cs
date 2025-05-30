using AetheriumBack.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace AetheriumBack.Database.Configuration;

public class SeatConfiguration : IEntityTypeConfiguration<Seat>
{
    public void Configure(EntityTypeBuilder<Seat> builder)
    {
        builder.ToTable(nameof(Seat), "Aetherium");

        builder.HasKey(c => c.SeatId);

        builder.Property(c => c.SeatNumber)
            .HasColumnName(nameof(Seat.SeatNumber))
            .IsRequired();

        builder.Property(c => c.SeatClass)
            .HasColumnName(nameof(Seat.SeatClass))
            .IsRequired();

        builder.Property(c => c.SeatType)
            .HasColumnName(nameof(Seat.SeatType))
            .IsRequired();

        builder.Property(c => c.SeatStatus)
            .HasColumnName(nameof(Seat.SeatStatus))
            .IsRequired();

        builder.HasOne(c => c.Flight)
            .WithMany(f => f.Seat)
            .HasForeignKey(c => c.FlightId)
            .OnDelete(DeleteBehavior.Cascade);

    }
}
