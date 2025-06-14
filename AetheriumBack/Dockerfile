# Usa la imagen oficial de .NET SDK para construir la app
FROM mcr.microsoft.com/dotnet/sdk:6.0 AS build
WORKDIR /app

# Copia todo el contenido y restaura paquetes
COPY . . 
RUN dotnet publish -c Release -o out

# Usa una imagen más ligera para ejecutar la app
FROM mcr.microsoft.com/dotnet/aspnet:6.0
WORKDIR /app
COPY --from=build /app/out .

# Expón el puerto que usará la app
EXPOSE 80
ENTRYPOINT ["dotnet", "AetheriumBack.dll"]
