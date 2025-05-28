using AetheriumBack.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace AetheriumBack.Database.Configuration;

public class UserStatConfiguration : IEntityTypeConfiguration<UserStat>
{
    public void Configure(EntityTypeBuilder<UserStat> builder)
    {
        builder.ToTable(nameof(UserStat), "Aetherium");

        builder.HasKey(c => c.UserId);

        builder.Property(c => c.TotalFlights)
            .HasColumnName(nameof(UserStat.TotalFlights))
            .IsRequired();

        builder.Property(c => c.TotalHours)
            .HasColumnName(nameof(UserStat.TotalHours))
            .IsRequired();

        builder.Property(c => c.FirstFlight)
            .HasColumnName(nameof(UserStat.FirstFlight))
            .IsRequired();

        builder.Property(c => c.LastFlight)
            .HasColumnName(nameof(UserStat.LastFlight))
            .IsRequired();

        builder.Property(c => c.TimesInFirstClass)
            .HasColumnName(nameof(UserStat.TimesInFirstClass))
            .IsRequired();

        builder.Property(c => c.MostUsedAirline)
            .HasColumnName(nameof(UserStat.MostUsedAirline))
            .HasMaxLength(100)
            .IsRequired();

        builder.Property(c => c.TotalSpent)
            .HasColumnName(nameof(UserStat.TotalSpent))
            .IsRequired();
    }
}
