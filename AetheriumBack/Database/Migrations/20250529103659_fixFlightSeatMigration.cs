using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace AetheriumBack.Database.Migrations
{
    /// <inheritdoc />
    public partial class fixFlightSeatMigration : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_Seat_FlightId",
                schema: "Aetherium",
                table: "Seat");

            migrationBuilder.CreateIndex(
                name: "IX_Seat_FlightId",
                schema: "Aetherium",
                table: "Seat",
                column: "FlightId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_Seat_FlightId",
                schema: "Aetherium",
                table: "Seat");

            migrationBuilder.CreateIndex(
                name: "IX_Seat_FlightId",
                schema: "Aetherium",
                table: "Seat",
                column: "FlightId",
                unique: true);
        }
    }
}
