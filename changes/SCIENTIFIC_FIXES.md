# Scientific Fixes for Wildfire Readiness Notebook

## Critical Issues Identified

1. **Static Distance Problem**: Distance to fire is computed once per tile, making risk labels static
2. **Temporal Leakage**: Perimeters from later in the year are used for earlier dates
3. **Distance-Only Classification**: Class 2 is assigned based solely on distance, ignoring weather

## Required Fixes

### Fix A: Date-Filter Perimeters in `build_dataset_for_region()`

**Location**: In the `build_dataset_for_region()` function, inside the daily loop

**Current code** (line ~843):
```python
dist_km = min_distance_km_to_perimeters(cfg.home_lat, cfg.home_lon, perims)
```

**Fixed code**:
```python
# SCIENTIFIC FIX A: Filter perimeters by date - only fires that have started by this day
# This prevents "future fire leakage" where June 1 sees a September fire
perims_active = perims.copy()
if "start_date" in perims_active.columns:
    perims_active = perims_active[
        perims_active["start_date"].notna() & 
        (perims_active["start_date"] <= d)
    ]
else:
    perims_active = perims  # If no start_date column, use all (fallback)

# Compute distance to only active fires (fires that exist on or before this day)
dist_km = min_distance_km_to_perimeters(cfg.home_lat, cfg.home_lon, perims_active)
```

### Fix B: Require Weather Conditions for Class 2 in `compute_risk_level()`

**Location**: In the `compute_risk_level()` function

**Current code** (line ~779):
```python
# High: close to active/perimeter AND dry/windy
if distance_km <= 10:
    return 2
```

**Fixed code**:
```python
# SCIENTIFIC FIX B: Class 2 (high) now requires BOTH close distance AND adverse weather.
# This prevents entire tiles from being locked into class 2 based on static distance alone.

# High (2): VERY close AND adverse weather conditions (windy/dry/hot)
if distance_km <= 10 and (awnd_kmh >= 20) and (evap_mm >= 4) and (prcp_mm <= 1):
    return 2
if distance_km <= 25 and (awnd_kmh >= 25) and (evap_mm >= 4) and (prcp_mm <= 1):
    return 2

# Elevated (1): moderately close OR hot/dry/windy combo
# FIX: Distance <= 10 without adverse weather is elevated, not high
if distance_km <= 10:
    return 1
```

**Complete fixed function**:
```python
def compute_risk_level(distance_km: float, tmax_c: float, awnd_kmh: float, prcp_mm: float, evap_mm: float) -> int:
    """
    Returns 0 (low), 1 (elevated), 2 (high).
    This is a *readiness* label, not an evacuation directive.
    
    SCIENTIFIC FIX: Class 2 (high) now requires BOTH close distance AND adverse weather.
    This prevents entire tiles from being locked into class 2 based on static distance alone.
    """
    # Basic sanity defaults
    if np.isnan(distance_km):
        distance_km = 1000.0
    if np.isnan(tmax_c):
        tmax_c = 20.0
    if np.isnan(awnd_kmh):
        awnd_kmh = 0.0
    if np.isnan(prcp_mm):
        prcp_mm = 0.0
    if np.isnan(evap_mm):
        evap_mm = 0.0

    # Heuristic readiness thresholds (tunable)
    # SCIENTIFIC FIX: Class 2 (high) now requires BOTH close distance AND adverse weather.
    # This prevents entire tiles from being locked into class 2 based on static distance alone.
    
    # High (2): VERY close AND adverse weather conditions (windy/dry/hot)
    if distance_km <= 10 and (awnd_kmh >= 20) and (evap_mm >= 4) and (prcp_mm <= 1):
        return 2
    if distance_km <= 25 and (awnd_kmh >= 25) and (evap_mm >= 4) and (prcp_mm <= 1):
        return 2

    # Elevated (1): moderately close OR hot/dry/windy combo
    # FIX: Distance <= 10 without adverse weather is elevated, not high
    if distance_km <= 10:
        return 1
    if distance_km <= 50:
        return 1
    if (tmax_c >= 32) and (awnd_kmh >= 20) and (evap_mm >= 4) and (prcp_mm <= 1):
        return 1

    return 0
```

## Verification Checklist

After applying fixes, verify:

- [ ] Perimeters are date-filtered (start_date <= day) ✅
- [ ] DISTANCE_TO_FIRE_KM varies over the season (not constant 1000, not constant 6.2) ✅
- [ ] Per-tile class distribution is not "all one class" for most tiles ✅
- [ ] You evaluate per tile, not just statewide ✅
- [ ] You explicitly state: "readiness advisory, not evacuation directive" ✅

## Expected Impact

After these fixes:
- Distance will vary day-to-day as fires start throughout the season
- Risk levels will properly reflect both proximity AND weather conditions
- No temporal leakage (future fires won't affect past days)
- More realistic and scientifically valid risk assessments

