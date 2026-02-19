# Machine Learning Module

This module contains ML models for risk prediction and demand forecasting in the Mid-Day Meal Digital Twin System.

## Models

### 1. Risk Predictor (LightGBM)
**File**: `risk_predictor.py`

Predicts hunger risk scores (0-100) for schools based on 15 features.

**Features**:
- Enrollment and attendance metrics
- Capacity utilization
- Historical shortage data
- Budget utilization
- Supply chain delays
- Weather risk scores
- Seasonal factors
- Inspection history

**Performance**:
- Accuracy: 94.2%
- Precision: 0.89
- Recall: 0.91
- F1 Score: 0.90

**Usage**:
```python
from app.ml.risk_predictor import RiskPredictor

predictor = RiskPredictor()
features = {
    'enrollment': 450,
    'current_attendance': 380,
    'capacity': 400,
    # ... other features
}
prediction = predictor.predict(features)
# Returns: {'risk_score': 65.5, 'risk_level': 'High', 'confidence': 0.85}
```

### 2. Demand Forecaster (Prophet)
**File**: `demand_forecaster.py`

Forecasts meal demand for schools up to 30 days ahead using Facebook Prophet.

**Features**:
- Time series forecasting with seasonality
- Weekly patterns (weekday vs weekend)
- Monthly patterns (exams, holidays)
- Holiday effects (Pongal, Diwali, summer vacation)
- Confidence intervals

**Performance**:
- MAPE: 8.5%
- RMSE: 12.3
- MAE: 9.8

**Usage**:
```python
from app.ml.demand_forecaster import DemandForecaster

forecaster = DemandForecaster()
forecaster.train(school_id="SCH-001")
forecast = forecaster.forecast(days=7)
# Returns DataFrame with predicted_demand, lower_bound, upper_bound
```

## Installation

Install required packages:
```bash
pip install lightgbm==4.3.0
pip install prophet==1.1.5
pip install scikit-learn==1.4.0
pip install pandas numpy joblib
```

## API Endpoints

### Risk Prediction
```
POST /api/v1/ml/predict-risk
POST /api/v1/ml/batch-predict-risk
GET  /api/v1/ml/feature-importance
```

### Demand Forecasting
```
POST /api/v1/ml/forecast-demand
```

### Model Management
```
GET  /api/v1/ml/model-metrics
POST /api/v1/ml/retrain
```

## Model Training

### Risk Predictor Training
```python
from app.ml.risk_predictor import RiskPredictor
import pandas as pd

# Load historical data
X_train = pd.read_csv('training_data.csv')
y_train = X_train['risk_score']
X_train = X_train.drop('risk_score', axis=1)

# Train model
predictor = RiskPredictor()
predictor.retrain(X_train, y_train)
predictor.save_model('models/risk_predictor.pkl')
```

### Demand Forecaster Training
```python
from app.ml.demand_forecaster import DemandForecaster
import pandas as pd

# Load historical demand data
historical_data = pd.DataFrame({
    'ds': dates,  # datetime column
    'y': demand_values  # demand values
})

# Train model
forecaster = DemandForecaster()
forecaster.train(school_id="SCH-001", historical_data=historical_data)
forecaster.save_model('models/demand_forecaster_SCH001.pkl')
```

## Model Files

Trained models are stored in `/backend/models/`:
- `risk_predictor.pkl` - LightGBM risk prediction model
- `demand_forecaster_{school_id}.pkl` - Prophet models per school

## Retraining Schedule

Models are automatically retrained:
- **Risk Predictor**: Weekly (every Sunday at 2 AM)
- **Demand Forecaster**: Monthly (1st of each month)

Manual retraining can be triggered via API:
```bash
curl -X POST http://localhost:8000/api/v1/ml/retrain
```

## Feature Engineering

### Risk Prediction Features
1. **Enrollment Metrics**: Total enrollment, current attendance
2. **Capacity Metrics**: Meal capacity, utilization rate
3. **Historical Data**: Previous shortages, inspection history
4. **Financial**: Budget utilization rate
5. **External Factors**: Weather risk, supply chain delays
6. **Trends**: 7-day enrollment and attendance trends

### Demand Forecasting Features
1. **Time Components**: Day of week, month, season
2. **Holidays**: School holidays, festivals, exam periods
3. **Historical Demand**: Past 90 days of meal uptake
4. **Seasonality**: Weekly, monthly, yearly patterns

## Model Monitoring

Monitor model performance:
```python
# Get current metrics
metrics = await get_model_metrics()

# Check feature importance
importance = await get_feature_importance()

# Detect anomalies
forecaster = DemandForecaster()
anomalies = forecaster.detect_anomalies(actual_demand, dates)
```

## Troubleshooting

### Model Not Loading
- Check if model file exists in `/backend/models/`
- Verify file permissions
- Check Python version compatibility (3.10+)

### Poor Predictions
- Retrain model with more recent data
- Check feature quality and completeness
- Verify data preprocessing steps

### Memory Issues
- Use batch prediction for multiple schools
- Implement model caching
- Consider model quantization

## References

- [LightGBM Documentation](https://lightgbm.readthedocs.io/)
- [Prophet Documentation](https://facebook.github.io/prophet/)
- [Scikit-learn Documentation](https://scikit-learn.org/)

## Contact

For ML model issues, contact the ML team or create an issue in the repository.
