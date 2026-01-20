using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace RiskApi.Migrations
{
    /// <inheritdoc />
    public partial class AddTreatmentAndReports : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "Evidence",
                table: "TreatmentControls",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "ImplementedAt",
                table: "TreatmentControls",
                type: "datetime2",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Status",
                table: "TreatmentControls",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<DateTime>(
                name: "CreatedAt",
                table: "Risks",
                type: "datetime2",
                nullable: false,
                defaultValueSql: "GETUTCDATE()");

            migrationBuilder.AddColumn<string>(
                name: "Observations",
                table: "Risks",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Recommendations",
                table: "Risks",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "UpdatedAt",
                table: "Risks",
                type: "datetime2",
                nullable: false,
                defaultValueSql: "GETUTCDATE()");

            migrationBuilder.UpdateData(
                table: "Controls",
                keyColumn: "Id",
                keyValue: 1,
                column: "Description",
                value: "Define and maintain information security policies.");

            migrationBuilder.UpdateData(
                table: "Controls",
                keyColumn: "Id",
                keyValue: 3,
                column: "Description",
                value: "Manage secure configurations for systems and services.");

            migrationBuilder.UpdateData(
                table: "Controls",
                keyColumn: "Id",
                keyValue: 4,
                columns: new[] { "Code", "Description", "Name" },
                values: new object[] { "8.16", "Log and monitor security events.", "Monitoring activities" });

            migrationBuilder.UpdateData(
                table: "Controls",
                keyColumn: "Id",
                keyValue: 5,
                columns: new[] { "Code", "Description", "Name" },
                values: new object[] { "8.12", "Prevent unauthorized data exfiltration.", "Data leakage prevention" });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Evidence",
                table: "TreatmentControls");

            migrationBuilder.DropColumn(
                name: "ImplementedAt",
                table: "TreatmentControls");

            migrationBuilder.DropColumn(
                name: "Status",
                table: "TreatmentControls");

            migrationBuilder.DropColumn(
                name: "CreatedAt",
                table: "Risks");

            migrationBuilder.DropColumn(
                name: "Observations",
                table: "Risks");

            migrationBuilder.DropColumn(
                name: "Recommendations",
                table: "Risks");

            migrationBuilder.DropColumn(
                name: "UpdatedAt",
                table: "Risks");

            migrationBuilder.UpdateData(
                table: "Controls",
                keyColumn: "Id",
                keyValue: 1,
                column: "Description",
                value: "Define and maintain security policies.");

            migrationBuilder.UpdateData(
                table: "Controls",
                keyColumn: "Id",
                keyValue: 3,
                column: "Description",
                value: "Manage secure configurations.");

            migrationBuilder.UpdateData(
                table: "Controls",
                keyColumn: "Id",
                keyValue: 4,
                columns: new[] { "Code", "Description", "Name" },
                values: new object[] { "8.12", "Prevent unauthorized data exfiltration.", "Data leakage prevention" });

            migrationBuilder.UpdateData(
                table: "Controls",
                keyColumn: "Id",
                keyValue: 5,
                columns: new[] { "Code", "Description", "Name" },
                values: new object[] { "8.16", "Log and monitor events.", "Monitoring activities" });
        }
    }
}
