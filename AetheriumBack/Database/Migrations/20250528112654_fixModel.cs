using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace AetheriumBack.Database.Migrations
{
    /// <inheritdoc />
    public partial class fixModel : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "FlightNumber",
                schema: "Aetherium",
                table: "Seat");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "FlightNumber",
                schema: "Aetherium",
                table: "Seat",
                type: "int",
                nullable: false,
                defaultValue: 0);
        }
    }
}
