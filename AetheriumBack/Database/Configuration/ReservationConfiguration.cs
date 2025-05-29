using AetheriumBack.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace AetheriumBack.Database.Configuration;

public class ReservationConfiguration : IEntityTypeConfiguration<Reservation>
{
    public void Configure(EntityTypeBuilder<Reservation> builder)
    {
        builder.ToTable(nameof(Reservation), "Aetherium");

        builder.HasKey(c => c.RerservationId);

        builder.Property(c => c.ReservationDateTime)
            .HasColumnName(nameof(Reservation.ReservationDateTime))
            .IsRequired();

        builder.HasOne(r => r.User)
            .WithOne(u => u.Reservation)
            .HasForeignKey<Reservation>(r => r.UserId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasOne(r => r.Flight)
            .WithMany(u => u.Reservation)
            .HasForeignKey(r => r.FlightId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasMany(r => r.Seat)
            .WithOne(u => u.Reservation)
            .HasForeignKey(r => r.SeatId)
            .OnDelete(DeleteBehavior.NoAction);
    }
}
