using AetheriumBack.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace AetheriumBack.Database.Configuration;

public class UserConfiguration : IEntityTypeConfiguration<User>
{
    public void Configure(EntityTypeBuilder<User> builder)
    {
        builder.ToTable(nameof(User), "Aetherium");

        builder.HasKey(c => c.UserId);

        builder.Property(c => c.FirstName)
            .HasColumnName(nameof(User.FirstName))
            .HasMaxLength(50)
            .IsRequired();

        builder.Property(c => c.LastName)
            .HasColumnName(nameof(User.LastName))
            .HasMaxLength(50)
            .IsRequired();

        builder.Property(c => c.Email)
            .HasColumnName(nameof(User.Email))
            .HasMaxLength(50)
            .IsRequired();

        builder.Property(c => c.Age)
            .HasColumnName(nameof(User.Age))
            .IsRequired();

        builder.Property(c => c.SignUpDate)
            .HasColumnName(nameof(User.SignUpDate))
            .IsRequired();
    }
}
