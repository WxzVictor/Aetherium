using AetheriumBack.Database;
using Microsoft.EntityFrameworkCore.Metadata;

namespace AetheriumBack.Utils;

public static class LoadCsv
{
    public static async Task SeedDataAsync(this IServiceProvider services)
    { 
        try
        {
            using IServiceScope scope = services.CreateScope();

            AetheriumContext context = scope.ServiceProvider.GetRequiredService<AetheriumContext>();

            string path = Directory.GetCurrentDirectory() + "\\Data";
            IEnumerable<string> files = Directory.GetFiles(Path.Combine(Directory.GetCurrentDirectory() + "\\Data"))
                .OrderBy(f => Path.GetFileName(f).Contains("Reservation") ? 1 : 0);

            if (files.Any())
            {
                foreach (string file in files)
                {
                    Console.WriteLine($"🔄️ Procesando archivo: {Path.GetFileName(file)}");
                    ParseTypes(file, context);
                    await context.SaveChangesAsync();
                    Console.WriteLine($"✅ Archivo guardado: {Path.GetFileName(file)}");
                }
            }
        }
        catch (Exception ex)
        {
            Console.WriteLine($"Error saving changes to the database: {ex.InnerException?.Message ?? ex.Message}");
        }
    }

    private static void ParseTypes(string fileName, AetheriumContext context)
    {
        using StreamReader reader = new(fileName);

        string csvName = Path.GetFileName(fileName).Split(".")[0];

        reader.ReadLine();

        IEntityType aux = context.Model.GetEntityTypes()
            .First(t => t.ClrType.Name.Contains(csvName));

        Type entityType = aux.ClrType;

        while (!reader.EndOfStream)
        {
            string? line = reader.ReadLine();
            string[] values = line!.Split(',');
            object createdInstance = Activator.CreateInstance(entityType, [values])!;

            context.Add(createdInstance);
        }
    }
}
