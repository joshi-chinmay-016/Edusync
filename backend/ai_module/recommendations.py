from sqlalchemy.orm import Session
from .usage_analysis import get_usage_summary

def generate_recommendations(db: Session):
    summary = get_usage_summary(db)
    if summary["total_bookings"] == 0:
        return {"recommendations": ["Gather more booking data to generate insights."]}
        
    recommendations = []
    
    for room, counts in summary['underutilized'].items():
        if counts < 2:  # Threshold for underutilization
            recommendations.append(f"Room {room} is underutilized ({counts} bookings). Consider scheduling classes here.")
            
    for room, counts in summary['most_used'].items():
        if counts > 10:  # Threshold for heavy load
            recommendations.append(f"Room {room} is heavily used ({counts} bookings). Monitor for maintenance.")
            
    if not recommendations:
        recommendations.append("Classroom usage is optimally distributed. No critical recommendations right now.")
        
    return {"recommendations": recommendations}
