# Scenario-Based Readiness Assessment Design

## Overview

This wildfire readiness tool uses **scenario-based inputs** derived from historical patterns rather than real-time weather data. This design choice ensures reproducibility, appropriate framing, and alignment with the Presidential AI Challenge requirements.

## Design Rationale

### Why Scenario-Based (Not Real-Time)?

1. **Reproducibility**: All outputs can be verified and reproduced
2. **Safety**: Avoids unsafe real-time prediction claims
3. **Scope Alignment**: Focuses on readiness/preparedness, not emergency prediction
4. **Reliability**: No dependency on external APIs that could fail during evaluation
5. **Ethical Framing**: Clearly positions the tool as advisory, not emergency guidance

### What This Means

- **Inputs**: Representative historical weather patterns from 2022 fire season
- **Model**: Trained on historical 2022 California fire season data
- **Outputs**: Scenario-based readiness assessments, not real-time predictions
- **Purpose**: Demonstrates how the model works with realistic conditions

## Technical Implementation

### Scenario Generation

The `/scenario` endpoint generates representative inputs based on:
- **Region**: Different scenarios for Bay Area, Coastal, Inland Valley
- **Historical Patterns**: Values reflect typical 2022 fire season conditions
- **Distance Estimates**: Region-based estimates to historical fire perimeters

### Example Scenarios

**Bay Area / San Jose (ZIP 95130)**:
- TMAX: 28.0°C (typical summer)
- AWND: 15.0 km/h (moderate wind)
- PRCP: 0.0 mm (dry summer)
- EVAP: 4.5 mm (moderate dryness)
- Distance: 60 km (urban area estimate)

**Santa Cruz Coastal**:
- TMAX: 24.0°C (cooler coastal)
- AWND: 18.0 km/h (can be windier)
- PRCP: 0.0 mm
- EVAP: 3.5 mm
- Distance: 35 km (closer to fire-prone areas)

## User Interface Messaging

The UI clearly communicates:
- "Scenario-based readiness assessment"
- "Uses historical patterns, not real-time prediction"
- "Designed for preparedness awareness, not emergency prediction"
- "Advisory readiness only (not evacuation orders)"

## For Judges / Submission

**Recommended language**:

> "The user interface demonstrates the readiness assessment using historical and scenario-based inputs rather than real-time prediction. This design ensures reproducibility, avoids unsafe deployment claims, and keeps the system focused on preparedness rather than emergency decision-making."

## Future Enhancements (Optional)

If desired, the system could be extended with:
- Manual input controls for users to adjust scenarios
- Multiple scenario presets (dry summer, wet winter, etc.)
- Historical date selection to see how conditions changed over the 2022 season

These would remain scenario-based, not real-time prediction.

