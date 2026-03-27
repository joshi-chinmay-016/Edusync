import datetime
from sqlalchemy.orm import Session
from database import SessionLocal, engine
import models
import auth

# Initialize the db
models.Base.metadata.create_all(bind=engine)

def seed_data():
    db = SessionLocal()
    
    # Check if we already seeded
    if db.query(models.User).first():
        print("Database already seeded.")
        db.close()
        return

    print("Seeding Users...")
    # Passwords for all users is: password123
    hashed_pwd = auth.get_password_hash("password123")
    
    users = [
        models.User(name="System Admin", email="admin@edusync.local", password=hashed_pwd, role=models.RoleEnum.Admin),
        models.User(name="Dr. Emily Chen", email="emily.chen@edusync.local", password=hashed_pwd, role=models.RoleEnum.Faculty),
        models.User(name="Prof. Alan Turing", email="alan.turing@edusync.local", password=hashed_pwd, role=models.RoleEnum.Faculty),
        models.User(name="John Doe", email="john.doe@edusync.local", password=hashed_pwd, role=models.RoleEnum.Student)
    ]
    db.add_all(users)
    db.commit()

    print("Seeding Classrooms...")
    classrooms = [
        models.Classroom(room_name="Room 101", capacity=60, building="Science Building"),
        models.Classroom(room_name="Room 102", capacity=40, building="Science Building"),
        models.Classroom(room_name="Room 201", capacity=120, building="Main Auditorium Block"),
        models.Classroom(room_name="Room 303", capacity=30, building="Arts & Humanities"),
        models.Classroom(room_name="Room 404", capacity=50, building="Engineering Complex")
    ]
    db.add_all(classrooms)
    db.commit()

    print("Seeding Resources...")
    resources = [
        models.Resource(classroom_id=1, resource_name="Projector"),
        models.Resource(classroom_id=1, resource_name="Whiteboard"),
        models.Resource(classroom_id=1, resource_name="Microphone"),
        models.Resource(classroom_id=2, resource_name="Projector"),
        models.Resource(classroom_id=3, resource_name="Smart Board"),
        models.Resource(classroom_id=3, resource_name="Surround Sound System"),
        models.Resource(classroom_id=3, resource_name="Podium Microphone"),
        models.Resource(classroom_id=4, resource_name="Chalkboard"),
        models.Resource(classroom_id=5, resource_name="Projector"),
        models.Resource(classroom_id=5, resource_name="30 Desktop Computers")
    ]
    db.add_all(resources)
    db.commit()

    print("Seeding Bookings & Usage Logs...")
    now = datetime.datetime.utcnow()
    
    bookings = [
        models.Booking(user_id=2, classroom_id=1, start_time=now - datetime.timedelta(days=5, hours=-10), end_time=now - datetime.timedelta(days=5, hours=-12), status=models.BookingStatusEnum.Completed),
        models.Booking(user_id=3, classroom_id=1, start_time=now - datetime.timedelta(days=4, hours=-10), end_time=now - datetime.timedelta(days=4, hours=-12), status=models.BookingStatusEnum.Completed),
        models.Booking(user_id=2, classroom_id=2, start_time=now - datetime.timedelta(days=3, hours=-14), end_time=now - datetime.timedelta(days=3, hours=-16), status=models.BookingStatusEnum.Completed),
        models.Booking(user_id=3, classroom_id=3, start_time=now - datetime.timedelta(days=2, hours=-9), end_time=now - datetime.timedelta(days=2, hours=-11), status=models.BookingStatusEnum.Completed),
        models.Booking(user_id=2, classroom_id=5, start_time=now - datetime.timedelta(days=1, hours=-13), end_time=now - datetime.timedelta(days=1, hours=-15), status=models.BookingStatusEnum.Completed),
        models.Booking(user_id=3, classroom_id=1, start_time=now + datetime.timedelta(days=1, hours=-10), end_time=now + datetime.timedelta(days=1, hours=-12), status=models.BookingStatusEnum.Confirmed)
    ]
    db.add_all(bookings)

    logs = [
        models.UsageLog(classroom_id=1, user_id=2, action="BOOKED", usage_date=now - datetime.timedelta(days=8)),
        models.UsageLog(classroom_id=1, user_id=3, action="BOOKED", usage_date=now - datetime.timedelta(days=7)),
        models.UsageLog(classroom_id=2, user_id=2, action="BOOKED", usage_date=now - datetime.timedelta(days=6)),
        models.UsageLog(classroom_id=3, user_id=3, action="BOOKED", usage_date=now - datetime.timedelta(days=5)),
        models.UsageLog(classroom_id=5, user_id=2, action="BOOKED", usage_date=now - datetime.timedelta(days=4)),
        models.UsageLog(classroom_id=1, user_id=3, action="BOOKED", usage_date=now)
    ]
    db.add_all(logs)
    db.commit()

    print("Database seeding completed.")
    db.close()

if __name__ == "__main__":
    seed_data()
