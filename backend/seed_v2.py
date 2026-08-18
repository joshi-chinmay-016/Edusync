import datetime
from sqlalchemy.orm import Session
from app.db.session import SessionLocal, engine
from app.db.base import Base
import models # V1 models for RoleEnum
from app.models.organization import Department, Team
from app.models.agent import Agent
from app.models.location import Building, Location
from app.models.ticket import TicketCategory
from app.models.asset import AssetCategory, Asset
from app.models.sla import SLAPolicy
from app.models.knowledge import KnowledgeBaseArticle
import auth
import uuid

def seed_v2_data():
    db = SessionLocal()

    # Check if already seeded (users exist from V1, but check a V2 entity)
    if db.query(Department).first():
        print("Database already seeded with V2 data.")
        db.close()
        return

    print("Seeding Users...")
    hashed_pwd = auth.get_password_hash("password123")

    if db.query(models.User).count() == 0:
        users = [
            models.User(name="System Admin", email="admin@edusync.local", password=hashed_pwd, role="Admin"),
            models.User(name="Dr. Emily Chen", email="emily.chen@edusync.local", password=hashed_pwd, role="Faculty"),
            models.User(name="Prof. Alan Turing", email="alan.turing@edusync.local", password=hashed_pwd, role="Faculty"),
            models.User(name="John Doe", email="john.doe@edusync.local", password=hashed_pwd, role="Student"),
            models.User(name="Support Agent 1", email="agent1@edusync.local", password=hashed_pwd, role="Agent"),
            models.User(name="Support Agent 2", email="agent2@edusync.local", password=hashed_pwd, role="Agent")
        ]
        db.add_all(users)
        db.commit()
    else:
        print("Users already exist, skipping user creation.")

    print("Seeding Departments and Teams...")
    it_dept = Department(name="IT", description="Information Technology")
    accounts_dept = Department(name="ACCOUNTS", description="Finance and Accounts")
    maintenance_dept = Department(name="MAINTENANCE", description="Facilities Maintenance")

    db.add_all([it_dept, accounts_dept, maintenance_dept])
    db.commit()

    network_team = Team(department_id=it_dept.id, name="Network Team")
    hardware_team = Team(department_id=it_dept.id, name="Hardware Team")
    finance_team = Team(department_id=accounts_dept.id, name="Finance Team")

    db.add_all([network_team, hardware_team, finance_team])
    db.commit()

    print("Seeding Locations...")
    main_campus = Building(name="Main Campus", description="Main university campus")
    db.add(main_campus)
    db.commit()

    lab_a = Location(building_id=main_campus.id, name="Computer Lab A")
    library = Location(building_id=main_campus.id, name="Central Library")
    db.add_all([lab_a, library])
    db.commit()

    print("Seeding Assets...")
    cat_comp = AssetCategory(name="Computer")
    cat_net = AssetCategory(name="Network Access Point")
    db.add_all([cat_comp, cat_net])
    db.commit()

    asset1 = Asset(category_id=cat_comp.id, location_id=lab_a.id, name="Lab A PC 1", identifier="PC-A-01")
    asset2 = Asset(category_id=cat_net.id, location_id=library.id, name="Library WiFi AP", identifier="WIFI-LIB-01")
    db.add_all([asset1, asset2])
    db.commit()

    print("Seeding Ticket Categories...")
    cat_it = TicketCategory(name="Network")
    db.add(cat_it)
    db.commit()

    subcat_wifi = TicketCategory(parent_id=cat_it.id, name="WiFi")
    subcat_lan = TicketCategory(parent_id=cat_it.id, name="LAN")
    db.add_all([subcat_wifi, subcat_lan])
    db.commit()

    print("Seeding Agents...")
    agent1_user = db.query(models.User).filter_by(email="agent1@edusync.local").first()
    agent2_user = db.query(models.User).filter_by(email="agent2@edusync.local").first()

    agent1 = Agent(user_id=agent1_user.id, team_id=network_team.id)
    agent2 = Agent(user_id=agent2_user.id, team_id=hardware_team.id)
    db.add_all([agent1, agent2])
    db.commit()

    print("Seeding SLA Policies...")
    sla_critical = SLAPolicy(name="Critical", response_time_minutes=15, resolution_time_minutes=240, priority="Critical")
    sla_high = SLAPolicy(name="High", response_time_minutes=60, resolution_time_minutes=480, priority="High")
    db.add_all([sla_critical, sla_high])
    db.commit()

    print("Seeding Knowledge Base...")
    kb1 = KnowledgeBaseArticle(title="How to connect to Campus WiFi", content="Select EduSync_Secure and use your student credentials.", category="Network", status="PUBLISHED")
    db.add(kb1)
    db.commit()

    print("V2 Database seeding completed successfully.")
    db.close()

if __name__ == "__main__":
    seed_v2_data()