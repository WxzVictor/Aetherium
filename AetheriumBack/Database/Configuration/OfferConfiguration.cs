using AetheriumBack.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace AetheriumBack.Database.Configuration;

public class OfferConfiguration : IEntityTypeConfiguration<Offer>
{
    public void Configure(EntityTypeBuilder<Offer> builder)
    {
        builder.ToTable(nameof(Offer), "Aetherium");

        builder.HasKey(c => c.OfferId);

        builder.Property(c => c.DiscountPercentage)
            .HasColumnName(nameof(Offer.DiscountPercentage))
            .IsRequired();

        builder.Property(c => c.StartDate)
            .HasColumnName(nameof(Offer.StartDate))
            .IsRequired();

        builder.Property(c => c.EndDate)
            .HasColumnName(nameof(Offer.EndDate))
            .IsRequired();

        builder.HasOne(c => c.Flight)
            .WithOne(f => f.Offer)
            .HasForeignKey<Offer>(c => c.FlightId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasOne(c => c.Hotel)
            .WithMany(f => f.Offer)
            .HasForeignKey(c => c.HotelId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}
