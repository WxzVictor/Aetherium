# Etapa 1: build
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /app

# Copia solo el backend
COPY Aetherium/AetheriumBack/ ./AetheriumBack/

# Restaura y publica
WORKDIR /app/AetheriumBack
RUN dotnet restore
RUN dotnet publish -c Release -o /app/out

# Etapa 2: runtime
FROM mcr.microsoft.com/dotnet/aspnet:8.0
WORKDIR /app
COPY --from=build /app/out .

# Importante para Railway (usa el puerto asignado por variable de entorno)
ENV ASPNETCORE_URLS=http://+:8000
EXPOSE 8000

ENTRYPOINT ["dotnet", "AetheriumBack.dll"]