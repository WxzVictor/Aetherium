using AetheriumBack.Database;

namespace AetheriumBack.Utils;

public static class LoadCsv
{
    public static async void SeedDataAsync(IServiceProvider services)
    {
        using IServiceScope scope = services.CreateScope();
        AetheriumContext context = scope.ServiceProvider.GetRequiredService<AetheriumContext>();

        if (!context.Airports.Any())
        {
            string path = Directory.GetCurrentDirectory() + "\\Data";
            IEnumerable<string> directories = Directory.GetDirectories(Directory.GetCurrentDirectory() + "\\Data");

            if (!directories.Any())
            {
                foreach (string directory in directories)
                {
                    IEnumerable<string> lines = File.ReadAllLines($"Data/{directory}.csv").Skip(1);

                }
            }
            //foreach (string? line in lines)
            //{
            //    string[] parts = line.Split(',');
            //    context.Airports.Add(new Airport { Name = parts[0], Code = parts[1] });
            //}
            await context.SaveChangesAsync();
        }
    }

}
