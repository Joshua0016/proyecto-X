# Fase base para ejecución
FROM mcr.microsoft.com/dotnet/aspnet:9.0 AS base
WORKDIR /app
EXPOSE 8080
EXPOSE 8081

# Fase de compilación
FROM mcr.microsoft.com/dotnet/sdk:9.0 AS build
ARG BUILD_CONFIGURATION=Release
WORKDIR /src
COPY ["Backend/Backend.csproj", "Backend/"] 
RUN dotnet restore "Backend/Backend.csproj"
COPY . .
# WORKDIR "/src/backend" 
 WORKDIR "/SolutionApi/Backend" 
RUN dotnet build "Backend.csproj" -c $BUILD_CONFIGURATION -o /app/build 

# Fase para publicar
FROM build AS publish
RUN dotnet publish "Backend.csproj" -c $BUILD_CONFIGURATION -o /app/publish /p:UseAppHost=false

# Fase final
FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish . 
ENTRYPOINT ["dotnet", "Backend.dll"]