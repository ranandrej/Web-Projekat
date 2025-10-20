# 🎯 KvizHub

Moderna web aplikacija za kreiranje i rešavanje kvizova sa real-time funkcionalnostima. Projekat iz predmeta **Primena web programiranja u infrastrukturnim sistemima**.

## 📋 Sadržaj

- [O projektu](#o-projektu)
- [Tehnologije](#tehnologije)
- [Funkcionalnosti](#funkcionalnosti)
- [Instalacija](#instalacija)
- [Pokretanje](#pokretanje)
- [Struktura projekta](#struktura-projekta)
- [API Dokumentacija](#api-dokumentacija)
- [Podaci za testiranje](#podaci-za-testiranje)


## 🛠️ Tehnologije

### Backend
- **.NET 8.0** - Backend framework
- **ASP.NET Core Web API** - RESTful API
- **Entity Framework Core** - ORM
- **PostgreSQL** - Baza podataka
- **JWT** - Autentifikacija
- **AutoMapper** - Object mapping
- **Serilog** - Logging
- **ASP.NET Identity** - User management

### Frontend
- **React 18** - UI framework
- **Vite** - Build tool
- **React Router** - Routing
- **Axios** - HTTP klijent

### Arhitektura
- **Clean Architecture** - Organizacija koda
- **Repository Pattern** - Data access
- **Service Layer** - Business logika
- **DTOs** - Data transfer

## ✨ Funkcionalnosti

### 👤 Korisnici
- Registracija i prijava
- JWT autentifikacija
- Profil i upravljanje nalogom
- Praćenje sopstvenih rezultata

### 📝 Kvizovi
- Kreiranje kvizova sa različitim tipovima pitanja:
  - Multiple Choice
  - True/False
  - Multiple Select
  - Short Answer
- Kategorije kvizova (Technology, Science, History, itd.)
- Nivoi težine (Easy, Medium, Hard)
- Vremenska ograničenja
- Javni i privatni kvizovi

### 🎮 Rešavanje kvizova
- Interaktivno rešavanje
- Timer za kviz i pojedinačna pitanja
- Trenutni rezultati
- Detaljna analiza odgovora

### 🏆 Leaderboard
- Globalni rang lista
- Filtriranje po vremenu (danas, nedelja, mesec, sva vremena)
- Rang liste po specifičnom kvizu
- Praćenje najboljih rezultata

### 👨‍💼 Admin panel
- Upravljanje korisnicima
- Pregled svih kvizova
- Statistika sistema
- Pregled pokušaja
- Kontrola pristupa

## 📦 Instalacija

### Preduslov
- [.NET 8.0 SDK](https://dotnet.microsoft.com/download)
- [Node.js](https://nodejs.org/) (v18+)
- [PostgreSQL](https://www.postgresql.org/)

### Backend setup

1. **Kloniraj repozitorijum**
```bash
git clone https://github.com/ranandrej/Web-Projekat.git
cd Web-Projekat/backend
```

2. **Konfiguriši bazu podataka**

Kreiraj PostgreSQL bazu:
```sql
CREATE DATABASE kvizhub;
```

3. **Podesi connection string**

Otvori `backend/src/KvizHub.API/appsettings.json` i izmeni:
```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Host=localhost;Database=kvizhub;Username=postgres;Password=tvoja_lozinka"
  }
}
```

4. **Instaliraj zavisnosti i pokreni migracije**
```bash
cd src/KvizHub.API
dotnet restore
dotnet ef database update
```

### Frontend setup

1. **Navigacija do frontend foldera**
```bash
cd ../../frontend
```

2. **Instalacija dependencija**
```bash
npm install
```

## 🚀 Pokretanje

### Backend
```bash
cd backend/src/KvizHub.API
dotnet run
```
Backend će biti dostupan na: `http://localhost:8080`

Swagger dokumentacija: `http://localhost:8080/swagger`

### Frontend
```bash
cd frontend
npm run dev
```
Frontend će biti dostupan na: `http://localhost:5173`

## 📁 Struktura projekta

```
Web-Projekat/
├── backend/
│   └── src/
│       ├── KvizHub.API/              # Web API layer
│       │   ├── Controllers/          # API kontroleri
│       │   └── Program.cs            # Entry point
│       ├── KvizHub.Application/      # Business logic
│       │   ├── DTOs/                 # Data transfer objects
│       │   ├── Interfaces/           # Service interfaces
│       │   └── Mappings/             # AutoMapper profiles
│       ├── KvizHub.Domain/           # Domain models
│       │   ├── Entities/             # Entiteti
│       │   └── Enums/                # Enumeracije
│       ├── KvizHub.Infrastructure/   # Data access
│       │   ├── Data/                 # DbContext i migracije
│       │   └── Services/             # Service implementacije
│       └── KvizHub.Shared/           # Deljeni kod
└── frontend/                         # React aplikacija
    ├── src/
    │   ├── components/               # React komponente
    │   ├── pages/                    # Stranice
    │   ├── services/                 # API servisi
    │   └── utils/                    # Helper funkcije
    └── package.json
```


Projekat razvijen za predmet: *Primena web programiranja u infrastrukturnim sistemima*

## 📝 Licenca

Ovaj projekat je kreiran u obrazovne svrhe.
