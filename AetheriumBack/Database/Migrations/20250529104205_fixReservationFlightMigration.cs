using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace AetheriumBack.Database.Migrations
{
    /// <inheritdoc />
    public partial class fixReservationFlightMigration : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_Reservation_FlightId",
                schema: "Aetherium",
                table: "Reservation");

            migrationBuilder.CreateIndex(
                name: "IX_Reservation_FlightId",
                schema: "Aetherium",
                table: "Reservation",
                column: "FlightId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_Reservation_FlightId",
                schema: "Aetherium",
                table: "Reservation");

            migrationBuilder.CreateIndex(
                name: "IX_Reservation_FlightId",
                schema: "Aetherium",
                table: "Reservation",
                column: "FlightId",
                unique: true);
        }
    }
}
