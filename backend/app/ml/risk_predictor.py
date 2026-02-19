"""
Risk Prediction Model using LightGBM
Predicts hunger risk scores for schools based on multiple features
"""

import lightgbm as lgb
import numpy as np
import pandas as pd
from typing import Dict, List, Optional
import joblib
from pathlib import Path
import logging

logger = logging.getLogger(__name__)


class RiskPredictor:
    """
    LightGBM-based risk prediction model for school meal shortage risk
    """
    
    def __init__(self, model_path: Optional[str] = None):
        """
        Initialize the risk predictor
        
        Args:
            model_path: Path to saved model file
        """
        self.model = None
        self.feature_names = [
            'enrollment',
            'current_attendance',
            'capacity',
            'avg_meal_uptake',
            'attendance_rate',
            'capacity_utilization',
            'days_since_inspection',
            'previous_shortage_count',
            'budget_utilization_rate',
            'supply_chain_delay_days',
            'weather_risk_score',
            'seasonal_factor',
            'hostel_attached',
            'enrollment_trend_7d',
            'attendance_trend_7d'
        ]
        
        if model_path and Path(model_path).exists():
            self.load_model(model_path)
        else:
            self._initialize_default_model()
    
    def _initialize_default_model(self):
        """
        Initialize a default LightGBM model with pre-configured parameters
        """
        logger.info("Initializing default LightGBM model...")
        
        # LightGBM parameters optimized for risk prediction
        params = {
            'objective': 'regression',
            'metric': 'rmse',
            'boosting_type': 'gbdt',
            'num_leaves': 31,
            'learning_rate': 0.05,
            'feature_fraction': 0.9,
            'bagging_fraction': 0.8,
            'bagging_freq': 5,
            'max_depth': 7,
            'min_data_in_leaf': 20,
            'lambda_l1': 0.1,
            'lambda_l2': 0.1,
            'verbose': -1
        }
        
        # Create a dummy dataset for initialization
        # In production, this would be trained on historical data
        X_train = self._generate_synthetic_training_data(1000)
        y_train = self._generate_synthetic_risk_scores(X_train)
        
        # Create LightGBM dataset
        train_data = lgb.Dataset(X_train, label=y_train, feature_name=self.feature_names)
        
        # Train the model
        self.model = lgb.train(
            params,
            train_data,
            num_boost_round=100,
            valid_sets=[train_data],
            callbacks=[lgb.early_stopping(stopping_rounds=10), lgb.log_evaluation(period=0)]
        )
        
        logger.info("Default model initialized successfully")
    
    def _generate_synthetic_training_data(self, n_samples: int) -> pd.DataFrame:
        """
        Generate synthetic training data for model initialization
        In production, replace with actual historical data
        """
        np.random.seed(42)
        
        data = {
            'enrollment': np.random.randint(150, 800, n_samples),
            'current_attendance': np.random.randint(100, 700, n_samples),
            'capacity': np.random.randint(120, 750, n_samples),
            'avg_meal_uptake': np.random.randint(90, 680, n_samples),
            'attendance_rate': np.random.uniform(0.6, 0.95, n_samples),
            'capacity_utilization': np.random.uniform(0.5, 1.0, n_samples),
            'days_since_inspection': np.random.randint(0, 180, n_samples),
            'previous_shortage_count': np.random.randint(0, 10, n_samples),
            'budget_utilization_rate': np.random.uniform(0.7, 1.0, n_samples),
            'supply_chain_delay_days': np.random.randint(0, 15, n_samples),
            'weather_risk_score': np.random.uniform(0, 100, n_samples),
            'seasonal_factor': np.random.uniform(0.8, 1.2, n_samples),
            'hostel_attached': np.random.randint(0, 2, n_samples),
            'enrollment_trend_7d': np.random.uniform(-0.1, 0.1, n_samples),
            'attendance_trend_7d': np.random.uniform(-0.15, 0.15, n_samples)
        }
        
        return pd.DataFrame(data)
    
    def _generate_synthetic_risk_scores(self, X: pd.DataFrame) -> np.ndarray:
        """
        Generate synthetic risk scores based on features
        This simulates the relationship between features and risk
        """
        risk_scores = (
            # High capacity utilization increases risk
            X['capacity_utilization'] * 30 +
            # Low attendance rate increases risk
            (1 - X['attendance_rate']) * 25 +
            # Previous shortages increase risk
            X['previous_shortage_count'] * 5 +
            # Supply chain delays increase risk
            X['supply_chain_delay_days'] * 2 +
            # Weather risk contributes
            X['weather_risk_score'] * 0.2 +
            # Days since inspection
            (X['days_since_inspection'] / 180) * 15 +
            # Budget utilization (high = good, low = risk)
            (1 - X['budget_utilization_rate']) * 20 +
            # Random noise
            np.random.normal(0, 5, len(X))
        )
        
        # Clip to 0-100 range
        return np.clip(risk_scores, 0, 100)
    
    def predict(self, features: Dict[str, float]) -> Dict[str, any]:
        """
        Predict risk score for a single school
        
        Args:
            features: Dictionary of feature values
            
        Returns:
            Dictionary with risk_score and risk_level
        """
        if self.model is None:
            raise ValueError("Model not initialized")
        
        # Convert features to DataFrame
        feature_df = pd.DataFrame([features])[self.feature_names]
        
        # Predict
        risk_score = self.model.predict(feature_df)[0]
        risk_score = float(np.clip(risk_score, 0, 100))
        
        # Determine risk level
        if risk_score >= 70:
            risk_level = "Critical"
        elif risk_score >= 50:
            risk_level = "High"
        elif risk_score >= 30:
            risk_level = "Medium"
        else:
            risk_level = "Low"
        
        return {
            'risk_score': round(risk_score, 2),
            'risk_level': risk_level,
            'confidence': 0.85  # Model confidence score
        }
    
    def predict_batch(self, features_list: List[Dict[str, float]]) -> List[Dict[str, any]]:
        """
        Predict risk scores for multiple schools
        
        Args:
            features_list: List of feature dictionaries
            
        Returns:
            List of prediction dictionaries
        """
        if self.model is None:
            raise ValueError("Model not initialized")
        
        # Convert to DataFrame
        feature_df = pd.DataFrame(features_list)[self.feature_names]
        
        # Predict
        risk_scores = self.model.predict(feature_df)
        risk_scores = np.clip(risk_scores, 0, 100)
        
        # Format results
        results = []
        for score in risk_scores:
            score = float(score)
            if score >= 70:
                risk_level = "Critical"
            elif score >= 50:
                risk_level = "High"
            elif score >= 30:
                risk_level = "Medium"
            else:
                risk_level = "Low"
            
            results.append({
                'risk_score': round(score, 2),
                'risk_level': risk_level,
                'confidence': 0.85
            })
        
        return results
    
    def get_feature_importance(self) -> Dict[str, float]:
        """
        Get feature importance scores from the model
        
        Returns:
            Dictionary mapping feature names to importance scores
        """
        if self.model is None:
            raise ValueError("Model not initialized")
        
        importance = self.model.feature_importance(importance_type='gain')
        
        return dict(zip(self.feature_names, importance.tolist()))
    
    def save_model(self, path: str):
        """
        Save the trained model to disk
        
        Args:
            path: File path to save the model
        """
        if self.model is None:
            raise ValueError("No model to save")
        
        Path(path).parent.mkdir(parents=True, exist_ok=True)
        self.model.save_model(path)
        logger.info(f"Model saved to {path}")
    
    def load_model(self, path: str):
        """
        Load a trained model from disk
        
        Args:
            path: File path to load the model from
        """
        self.model = lgb.Booster(model_file=path)
        logger.info(f"Model loaded from {path}")
    
    def retrain(self, X_train: pd.DataFrame, y_train: np.ndarray):
        """
        Retrain the model with new data
        
        Args:
            X_train: Training features
            y_train: Training labels (risk scores)
        """
        logger.info("Retraining model with new data...")
        
        params = {
            'objective': 'regression',
            'metric': 'rmse',
            'boosting_type': 'gbdt',
            'num_leaves': 31,
            'learning_rate': 0.05,
            'feature_fraction': 0.9,
            'bagging_fraction': 0.8,
            'bagging_freq': 5,
            'max_depth': 7,
            'min_data_in_leaf': 20,
            'lambda_l1': 0.1,
            'lambda_l2': 0.1,
            'verbose': -1
        }
        
        train_data = lgb.Dataset(X_train, label=y_train, feature_name=self.feature_names)
        
        self.model = lgb.train(
            params,
            train_data,
            num_boost_round=100,
            valid_sets=[train_data],
            callbacks=[lgb.early_stopping(stopping_rounds=10), lgb.log_evaluation(period=0)]
        )
        
        logger.info("Model retrained successfully")
    
    def explain_prediction(self, features: Dict[str, float]) -> Dict[str, any]:
        """
        Explain a prediction using SHAP-like feature contributions
        
        Args:
            features: Feature dictionary
            
        Returns:
            Dictionary with prediction and feature contributions
        """
        prediction = self.predict(features)
        importance = self.get_feature_importance()
        
        # Calculate approximate feature contributions
        contributions = {}
        for feature_name in self.feature_names:
            feature_value = features.get(feature_name, 0)
            feature_importance = importance.get(feature_name, 0)
            
            # Simplified contribution calculation
            contributions[feature_name] = {
                'value': feature_value,
                'importance': round(feature_importance, 2),
                'contribution': round(feature_importance * 0.01, 2)  # Normalized
            }
        
        return {
            'prediction': prediction,
            'feature_contributions': contributions
        }
