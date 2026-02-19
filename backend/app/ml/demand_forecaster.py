"""
Demand Forecasting Model using Prophet
Predicts meal demand for schools over time
"""

from prophet import Prophet
import pandas as pd
import numpy as np
from typing import Dict, List, Optional
from datetime import datetime, timedelta
import logging
import joblib
from pathlib import Path

logger = logging.getLogger(__name__)


class DemandForecaster:
    """
    Prophet-based demand forecasting model for school meal demand prediction
    """
    
    def __init__(self, model_path: Optional[str] = None):
        """
        Initialize the demand forecaster
        
        Args:
            model_path: Path to saved model file
        """
        self.model = None
        self.school_id = None
        
        if model_path and Path(model_path).exists():
            self.load_model(model_path)
    
    def _generate_historical_data(self, school_id: str, days: int = 90) -> pd.DataFrame:
        """
        Generate synthetic historical demand data for a school
        In production, this would fetch actual historical data from database
        
        Args:
            school_id: School identifier
            days: Number of historical days to generate
            
        Returns:
            DataFrame with 'ds' (date) and 'y' (demand) columns
        """
        np.random.seed(hash(school_id) % 2**32)
        
        # Generate dates
        end_date = datetime.now()
        dates = [end_date - timedelta(days=i) for i in range(days, 0, -1)]
        
        # Base demand with trend and seasonality
        base_demand = 350
        trend = np.linspace(0, 20, days)  # Slight upward trend
        
        # Weekly seasonality (lower on weekends)
        weekly_pattern = []
        for date in dates:
            if date.weekday() >= 5:  # Weekend
                weekly_pattern.append(0.3)
            else:
                weekly_pattern.append(1.0)
        
        # Monthly seasonality (exam periods, holidays)
        monthly_pattern = np.sin(np.linspace(0, 4 * np.pi, days)) * 30
        
        # Random noise
        noise = np.random.normal(0, 15, days)
        
        # Combine all components
        demand = base_demand + trend + monthly_pattern + noise
        demand = demand * np.array(weekly_pattern)
        demand = np.maximum(demand, 0)  # No negative demand
        
        # Create DataFrame in Prophet format
        df = pd.DataFrame({
            'ds': dates,
            'y': demand
        })
        
        return df
    
    def train(self, school_id: str, historical_data: Optional[pd.DataFrame] = None):
        """
        Train Prophet model for a specific school
        
        Args:
            school_id: School identifier
            historical_data: DataFrame with 'ds' and 'y' columns (optional)
        """
        logger.info(f"Training demand forecaster for school {school_id}...")
        
        self.school_id = school_id
        
        # Use provided data or generate synthetic data
        if historical_data is None:
            historical_data = self._generate_historical_data(school_id)
        
        # Initialize Prophet with custom parameters
        self.model = Prophet(
            growth='linear',
            yearly_seasonality=True,
            weekly_seasonality=True,
            daily_seasonality=False,
            seasonality_mode='additive',
            changepoint_prior_scale=0.05,
            seasonality_prior_scale=10.0,
            interval_width=0.95
        )
        
        # Add custom seasonalities
        self.model.add_seasonality(
            name='monthly',
            period=30.5,
            fourier_order=5
        )
        
        # Add holidays/special events (exam periods, festivals)
        holidays = self._create_holiday_dataframe()
        if not holidays.empty:
            self.model.holidays = holidays
        
        # Fit the model
        self.model.fit(historical_data)
        
        logger.info(f"Model trained successfully for school {school_id}")
    
    def _create_holiday_dataframe(self) -> pd.DataFrame:
        """
        Create a DataFrame of holidays and special events
        These affect meal demand patterns
        """
        current_year = datetime.now().year
        
        holidays = []
        
        # Tamil Nadu school holidays (approximate dates)
        # Pongal
        holidays.append({
            'holiday': 'pongal',
            'ds': pd.to_datetime(f'{current_year}-01-14'),
            'lower_window': -2,
            'upper_window': 2
        })
        
        # Summer vacation
        for day in range(30):
            holidays.append({
                'holiday': 'summer_vacation',
                'ds': pd.to_datetime(f'{current_year}-05-01') + timedelta(days=day),
                'lower_window': 0,
                'upper_window': 0
            })
        
        # Diwali
        holidays.append({
            'holiday': 'diwali',
            'ds': pd.to_datetime(f'{current_year}-11-01'),  # Approximate
            'lower_window': -1,
            'upper_window': 1
        })
        
        # Exam periods (reduced attendance)
        # Mid-term exams
        for day in range(10):
            holidays.append({
                'holiday': 'midterm_exams',
                'ds': pd.to_datetime(f'{current_year}-09-15') + timedelta(days=day),
                'lower_window': 0,
                'upper_window': 0
            })
        
        # Final exams
        for day in range(15):
            holidays.append({
                'holiday': 'final_exams',
                'ds': pd.to_datetime(f'{current_year}-03-15') + timedelta(days=day),
                'lower_window': 0,
                'upper_window': 0
            })
        
        return pd.DataFrame(holidays) if holidays else pd.DataFrame()
    
    def forecast(self, days: int = 7) -> pd.DataFrame:
        """
        Generate demand forecast for specified number of days
        
        Args:
            days: Number of days to forecast
            
        Returns:
            DataFrame with forecast including confidence intervals
        """
        if self.model is None:
            raise ValueError("Model not trained. Call train() first.")
        
        # Create future dataframe
        future = self.model.make_future_dataframe(periods=days)
        
        # Generate forecast
        forecast = self.model.predict(future)
        
        # Extract relevant columns and format
        result = forecast[['ds', 'yhat', 'yhat_lower', 'yhat_upper']].tail(days).copy()
        result.columns = ['date', 'predicted_demand', 'lower_bound', 'upper_bound']
        
        # Ensure no negative predictions
        result['predicted_demand'] = result['predicted_demand'].clip(lower=0)
        result['lower_bound'] = result['lower_bound'].clip(lower=0)
        result['upper_bound'] = result['upper_bound'].clip(lower=0)
        
        # Round to integers (can't have fractional meals)
        result['predicted_demand'] = result['predicted_demand'].round().astype(int)
        result['lower_bound'] = result['lower_bound'].round().astype(int)
        result['upper_bound'] = result['upper_bound'].round().astype(int)
        
        return result
    
    def forecast_with_capacity(self, days: int, capacity: int) -> Dict[str, any]:
        """
        Generate forecast and compare with capacity
        
        Args:
            days: Number of days to forecast
            capacity: School meal capacity
            
        Returns:
            Dictionary with forecast and capacity analysis
        """
        forecast_df = self.forecast(days)
        
        # Analyze capacity constraints
        shortage_days = []
        for idx, row in forecast_df.iterrows():
            if row['predicted_demand'] > capacity:
                shortage_days.append({
                    'date': row['date'].strftime('%Y-%m-%d'),
                    'predicted_demand': int(row['predicted_demand']),
                    'capacity': capacity,
                    'shortage': int(row['predicted_demand'] - capacity)
                })
        
        # Calculate risk metrics
        avg_demand = forecast_df['predicted_demand'].mean()
        max_demand = forecast_df['predicted_demand'].max()
        capacity_utilization = (avg_demand / capacity * 100) if capacity > 0 else 0
        
        return {
            'forecast': forecast_df.to_dict('records'),
            'capacity': capacity,
            'avg_predicted_demand': round(avg_demand, 2),
            'max_predicted_demand': int(max_demand),
            'capacity_utilization': round(capacity_utilization, 2),
            'shortage_days': shortage_days,
            'risk_level': 'High' if len(shortage_days) > 2 else 'Medium' if len(shortage_days) > 0 else 'Low'
        }
    
    def get_trend_components(self) -> Dict[str, pd.DataFrame]:
        """
        Extract trend and seasonality components from the model
        
        Returns:
            Dictionary with trend, weekly, and yearly components
        """
        if self.model is None:
            raise ValueError("Model not trained. Call train() first.")
        
        # Generate forecast for analysis
        future = self.model.make_future_dataframe(periods=30)
        forecast = self.model.predict(future)
        
        components = {
            'trend': forecast[['ds', 'trend']].tail(30),
            'weekly': forecast[['ds', 'weekly']].tail(30) if 'weekly' in forecast.columns else None,
            'yearly': forecast[['ds', 'yearly']].tail(30) if 'yearly' in forecast.columns else None,
        }
        
        return {k: v.to_dict('records') if v is not None else None for k, v in components.items()}
    
    def detect_anomalies(self, actual_demand: List[float], dates: List[datetime]) -> List[Dict]:
        """
        Detect anomalies by comparing actual demand with predictions
        
        Args:
            actual_demand: List of actual demand values
            dates: Corresponding dates
            
        Returns:
            List of detected anomalies
        """
        if self.model is None:
            raise ValueError("Model not trained. Call train() first.")
        
        # Create dataframe for prediction
        df = pd.DataFrame({'ds': dates})
        forecast = self.model.predict(df)
        
        anomalies = []
        for i, (actual, date) in enumerate(zip(actual_demand, dates)):
            predicted = forecast.iloc[i]['yhat']
            lower = forecast.iloc[i]['yhat_lower']
            upper = forecast.iloc[i]['yhat_upper']
            
            # Check if actual is outside confidence interval
            if actual < lower or actual > upper:
                deviation = abs(actual - predicted) / predicted * 100 if predicted > 0 else 0
                anomalies.append({
                    'date': date.strftime('%Y-%m-%d'),
                    'actual_demand': actual,
                    'predicted_demand': round(predicted, 2),
                    'lower_bound': round(lower, 2),
                    'upper_bound': round(upper, 2),
                    'deviation_percent': round(deviation, 2),
                    'type': 'spike' if actual > upper else 'drop'
                })
        
        return anomalies
    
    def save_model(self, path: str):
        """
        Save the trained model to disk
        
        Args:
            path: File path to save the model
        """
        if self.model is None:
            raise ValueError("No model to save")
        
        Path(path).parent.mkdir(parents=True, exist_ok=True)
        
        model_data = {
            'model': self.model,
            'school_id': self.school_id
        }
        
        joblib.dump(model_data, path)
        logger.info(f"Model saved to {path}")
    
    def load_model(self, path: str):
        """
        Load a trained model from disk
        
        Args:
            path: File path to load the model from
        """
        model_data = joblib.load(path)
        self.model = model_data['model']
        self.school_id = model_data.get('school_id')
        logger.info(f"Model loaded from {path}")
    
    def update_with_new_data(self, new_data: pd.DataFrame):
        """
        Update the model with new observations
        
        Args:
            new_data: DataFrame with 'ds' and 'y' columns
        """
        if self.model is None:
            raise ValueError("Model not trained. Call train() first.")
        
        logger.info("Updating model with new data...")
        
        # Retrain with combined data
        # In production, you'd fetch historical data and append new data
        self.model.fit(new_data)
        
        logger.info("Model updated successfully")
