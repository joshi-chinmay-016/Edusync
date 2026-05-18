from sklearn.linear_model import LinearRegression
from sqlalchemy.orm import Session
from .data_loader import load_bookings
import pandas as pd
import numpy as np

def train_and_predict(db: Session):
    df = load_bookings(db)
    if df.empty or len(df) < 10:
        return {"message": "Not enough data to train prediction model"}
        
    df['date'] = pd.to_datetime(df['start_time']).dt.date
    daily_bookings = df.groupby(['classroom_id', 'date']).size().reset_index(name='booking_count')
    
    # Simple feature extraction
    daily_bookings['day_of_week'] = pd.to_datetime(daily_bookings['date']).dt.dayofweek
    
    predictions = {}
    
    for classroom_id in daily_bookings['classroom_id'].unique():
        class_data = daily_bookings[daily_bookings['classroom_id'] == classroom_id]
        if len(class_data) < 3:
            continue
            
        X = class_data[['day_of_week']].values
        y = class_data['booking_count'].values
        
        model = LinearRegression()
        model.fit(X, y)
        
        # Predict for tomorrow
        tomorrow_dow = (pd.Timestamp.today().dayofweek + 1) % 7
        pred = model.predict([[tomorrow_dow]])
        predictions[int(classroom_id)] = max(0, int(round(pred[0])))
        
    return {"predictions_for_tomorrow": predictions}
