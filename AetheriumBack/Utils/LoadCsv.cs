using System.Globalization;
using AetheriumBack.Database;
using AetheriumBack.Models;

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
            IEnumerable<string> files = Directory.GetFiles(Path.Combine(Directory.GetCurrentDirectory() + "\\Data"))
                .Where(f => Path.GetFileName(f).ToLower().Contains("aeropuerto"));

            if (files.Any())
            {
                foreach (string file in files)
                {
                    using StreamReader reader = new(file);

                    reader.ReadLine();

                    while (!reader.EndOfStream)
                    {
                        string? line = reader.ReadLine();
                        string[] values = line.Split(',');

                        Airport airport = new(
                            values[0],
                            values[1],
                            values[2],
                            values[3],
                            float.Parse(values[4], CultureInfo.InvariantCulture),
                            float.Parse(values[5], CultureInfo.InvariantCulture),
                            int.Parse(values[6], CultureInfo.InvariantCulture),
                            values[7]
                        );
                        
                        context.Airports.Add(airport);
                    }
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
