using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;

namespace AetheriumBack.Database;

public class AetheriumContextFactory : IDesignTimeDbContextFactory<AetheriumContext>
{
    public AetheriumContext CreateDbContext(string[] args)
    {
        string basePath = Path.Combine(Directory.GetCurrentDirectory(), "..", "AetheriumBack");

        IConfiguration builder = new ConfigurationBuilder()
            .SetBasePath(basePath)
            .AddJsonFile("appsettings.json")
            .Build();

        DbContextOptionsBuilder<AetheriumContext> optionsBuilder = new();
        optionsBuilder.UseSqlServer(builder.GetConnectionString("DefaultConnection"));

        return new AetheriumContext(optionsBuilder.Options);
    }
}
