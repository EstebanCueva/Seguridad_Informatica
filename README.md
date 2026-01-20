# Risk MVP — Cyber Risk Assessment (ASP.NET Core + React)

Risk MVP is a **proof-of-concept web application** to **assess, treat, and monitor cyber risk** using a simple, practical methodology aligned with common risk management practices.

It covers the full flow required for a typical academic “cyber risk evaluation methodology” assignment:

- **Asset valuation** (CIA + asset value)
- **Risk identification** (threats, vulnerabilities, existing controls)
- **Risk scoring** (Probability × Impact) and **risk level**
- **Risk treatment** (strategies + responsible + due date)
- **ISO/IEC 27002:2022 controls selection** with implementation tracking
- **Residual risk** after treatment
- **Monitoring dashboard** (KPIs + charts + real trend from the database)
- **Reporting** (CSV export for stakeholders)
- **Communication fields** (observations & recommendations)

## Tech Stack

**Backend**
- ASP.NET Core Web API (.NET 8)
- Entity Framework Core + SQL Server
- Swagger/OpenAPI for API exploration

**Frontend**
- React (Vite)
- Material UI (MUI)
- Recharts for dashboards
- Axios for API calls

## Features

### 1) Assets (CRUD)
Create and manage assets with:
- Name, owner, description
- CIA values (1–5): Confidentiality, Integrity, Availability
- Asset value (1–5)

### 2) Risks (CRUD + auto calculation)
For each risk:
- Threat, vulnerability, existing controls
- Probability (1–5) and Impact (1–5)
- **Score is calculated automatically:** `Score = Probability × Impact`
- **Level is assigned automatically** (Low/Moderate/High/Critical)
- Status tracking (Pending/InProgress/Closed)
- Communication fields: **Observations** and **Recommendations**
- Residual Probability/Impact (optional)

### 3) Treatments (ISO Controls + tracking)
Create/update a treatment plan for a risk:
- Strategy: Mitigate / Transfer / Accept / Avoid
- Owner + Due date + Notes
- Select ISO/IEC 27002 controls (catalog)
- Track each control status:
  - Planned / InProgress / Implemented
  - Evidence text/link
- Set **Residual Probability/Impact**, and the app calculates residual score/level

### 4) Dashboard (Monitoring)
Includes:
- Total risks + distribution by level and status
- Control implementation KPIs (total vs implemented)
- **Risk Trend (real)** based on database `CreatedAt` values
- Charts for quick monitoring

### 5) Reporting
- Export stakeholders report: `risk-report.csv`

### 6) Seed Demo (optional)
One click to create demo data (assets + risks across different days) so dashboards look realistic.

## Requirements

- .NET SDK 8.x
- Node.js 18+ (recommended)
- SQL Server (local instance or SQL Express)
- (Optional) SSMS to view the DB

## Setup & Run

### 1) Backend (.NET API)

#### Configure connection string
Edit `RiskApi/appsettings.json`:

```json
{
  "ConnectionStrings": {
    "Default": "Server=localhost;Database=RiskMVP;Trusted_Connection=True;TrustServerCertificate=True;"
  }
}

From RiskApi/:

dotnet restore
dotnet tool run dotnet-ef migrations add InitialCreate
dotnet tool run dotnet-ef database update
dotnet run

From risk-ui/:
npm install
npm run dev



