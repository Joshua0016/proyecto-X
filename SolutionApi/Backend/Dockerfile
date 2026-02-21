# Fase base para ejecución
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS base
WORKDIR /app
EXPOSE 8080
EXPOSE 8081

# Fase de compilación
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
ARG BUILD_CONFIGURATION=Release
WORKDIR /src
COPY ["backend/Backend.csproj", "backend/"] 
RUN dotnet restore "backend/Backend.csproj" [cite: 4]
COPY . .
WORKDIR "/src/backend" 
RUN dotnet build "Backend.csproj" -c $BUILD_CONFIGURATION -o /app/build 

# Fase para publicar
FROM build AS publish
RUN dotnet publish "Backend.csproj" -c $BUILD_CONFIGURATION -o /app/publish /p:UseAppHost=false [cite: 6]

# Fase final
FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish . 
ENTRYPOINT ["dotnet", "Backend.dll"]