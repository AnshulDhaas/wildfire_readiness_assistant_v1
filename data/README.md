# Data Sources

This folder does not contain large datasets. All data is fetched programmatically at runtime.

## Data Sources Used

- **CAL FIRE FRAP (California Fire and Resource Assessment Program)**: Historical fire perimeter data in GeoJSON format. Downloaded from the California Natural Resources Agency data portal.
- **Open-Meteo Historical Weather API**: Daily weather data including maximum temperature, wind speed, precipitation, and evapotranspiration. Accessed via the Open-Meteo archive API.

## What Kind of Data is Pulled

- **Fire Perimeters**: Polygon geometries representing the extent of historical wildfires, filtered to the 2022 fire season
- **Weather Data**: Daily aggregated weather variables for the fire season period (June 1 - October 31, 2022)

## API Availability Caveats

- Open-Meteo is a free public API with rate limits. The notebook batches requests to respect these limits.
- CAL FIRE FRAP data is hosted by the California Natural Resources Agency and may experience occasional downtime.
- Data fetching may take several minutes on first run as historical data is downloaded and cached locally.

## Caching

Data is cached locally in the `api_cache/` directory (not committed to git) to avoid repeated API calls during development.

