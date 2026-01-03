# Phase 3 Debugging Fixes - Summary

## Issues Identified

1. **Timeout Error**: Open-Meteo API calls were timing out on tile 15 (and potentially others)
   - SSL handshake timeout after 60 seconds
   - No retry logic for failed requests
   - No delays between API calls (possible rate limiting)

2. **No Error Handling**: If one tile failed, the entire process would crash
   - All 16 tiles need to be processed, but failure on one tile stopped everything

3. **Missing Imports**: The `time` module needs to be imported for delays

## Fixes Applied

### 1. Updated `fetch_open_meteo_batched` function (Cell 4)
   - ✅ Added retry logic with exponential backoff (3 attempts)
   - ✅ Increased timeout from 60s to 90s
   - ✅ Added 1-second delay between batches to avoid rate limiting
   - ✅ Better error handling for timeouts, connection errors, and rate limiting (HTTP 429)

### 2. Manual Fixes Needed

#### Add `time` import to Cell 1:
Add this line after the other imports:
```python
import time
```

#### Update Phase 3 loop (Cell 5) with error handling:
Replace the loop section with:
```python
all_dfs = []
failed_tiles = []

for idx, tile_bbox in enumerate(tiles):
    lat_c, lon_c = tile_center(tile_bbox)
    cfg_tile = RegionConfig(
        name=f"CA_tile_{idx:02d}_2022",
        home_lat=lat_c,
        home_lon=lon_c,
        bbox=tile_bbox,
        start_date=CA_START,
        end_date=CA_END,
        year=2022
    )

    try:
        df_tile = build_dataset_for_region(cfg_tile, perims_year=perims_2022)
        df_tile["tile_id"] = cfg_tile.name
        df_tile["bbox"] = str(tile_bbox)
        all_dfs.append(df_tile)
        log(f"[CA] Successfully processed tile {idx:02d}")
    except Exception as e:
        log(f"[CA] ERROR: Failed to process tile {idx:02d} ({cfg_tile.name}): {type(e).__name__}: {str(e)}")
        failed_tiles.append((idx, cfg_tile.name, str(e)))
        # Add a delay before trying next tile to avoid overwhelming the API
        time.sleep(2.0)
        continue

if failed_tiles:
    log(f"[CA] WARNING: {len(failed_tiles)} tiles failed: {[t[1] for t in failed_tiles]}")

if not all_dfs:
    raise RuntimeError("No tiles were successfully processed. Check network connection and API availability.")

df_ca = pd.concat(all_dfs, ignore_index=True)
log(f"[CA] Combined rows: {len(df_ca)} from {len(all_dfs)} successful tiles")
df_ca.head()
```

## What These Fixes Do

1. **Retry Logic**: If an API call fails due to timeout or connection error, it will retry up to 3 times with exponential backoff (waiting 1s, 2s, 4s between retries)

2. **Rate Limiting Protection**: 
   - 1-second delay between batches within a tile
   - 2-second delay between tiles if one fails
   - Handles HTTP 429 (rate limit) responses gracefully

3. **Graceful Degradation**: If some tiles fail, the process continues with the successful ones and reports which tiles failed at the end

4. **Better Logging**: More informative error messages to help debug issues

## Testing Recommendations

1. Run the notebook and monitor the logs for any timeout/retry messages
2. If tiles still fail, you may need to:
   - Increase the delay between tiles (currently 2 seconds)
   - Reduce the number of tiles processed at once
   - Check your network connection
   - Verify Open-Meteo API is accessible

## Next Steps

After applying these fixes:
1. Re-run Cell 1 to ensure `time` is imported
2. Re-run Cell 4 to get the updated `fetch_open_meteo_batched` function
3. Update Cell 5 with the error-handling code above
4. Re-run Cell 5 to process all tiles

The cached data from previous successful runs will be reused, so only failed/missing tiles will be re-fetched.


