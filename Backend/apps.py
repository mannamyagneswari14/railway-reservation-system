import os
from django.apps import AppConfig

class BackendConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'Backend'

    def ready(self):
        # Only seed when running the main server, not during migrations or reload check
        if os.environ.get('RUN_MAIN') == 'true':
            try:
                self.seed_database()
            except Exception as e:
                # Silently fail if migrations haven't run yet
                print("Seeding deferred until database is migrated:", e)

    def seed_database(self):
        from .models import Passenger, Train, Schedule, Booking, Payment
        
        # 1. Seed Passengers
        if Passenger.objects.count() == 0:
            Passenger.objects.create(
                passenger_id=101,
                full_name="Rahul Sharma",
                email="rahul@gmail.com",
                phone="9876543210",
                gender="Male",
                age=28,
                address="Hyderabad",
                password="rahul123"
            )
            # Add Admin user
            Passenger.objects.create(
                passenger_id=100,
                full_name="System Administrator",
                email="admin@railway.com",
                phone="9999999999",
                gender="Male",
                age=35,
                address="Central HQ",
                password="admin123"  # In production use hashed passwords, but for this assignment plain password is ok
            )
            print("Seeded Passengers successfully.")

        # 2. Seed Trains
        if Train.objects.count() == 0:
            Train.objects.create(
                train_id=201,
                train_name="Vande Bharat Express",
                train_number="20678",
                train_type="Vande Bharat",
                total_seats=1128,
                source="Chennai",
                destination="Bangalore"
            )
            Train.objects.create(
                train_id=202,
                train_name="Rajdhani Express",
                train_number="12430",
                train_type="Rajdhani",
                total_seats=800,
                source="Delhi",
                destination="Mumbai"
            )
            Train.objects.create(
                train_id=203,
                train_name="Shatabdi Express",
                train_number="12002",
                train_type="Shatabdi",
                total_seats=600,
                source="Delhi",
                destination="Bhopal"
            )
            Train.objects.create(
                train_id=204,
                train_name="Deccan Queen",
                train_number="12124",
                train_type="Superfast",
                total_seats=750,
                source="Pune",
                destination="Mumbai"
            )
            Train.objects.create(
                train_id=205,
                train_name="Garib Rath Express",
                train_number="12910",
                train_type="Express",
                total_seats=950,
                source="Mumbai",
                destination="Delhi"
            )
            print("Seeded Trains successfully.")

        # 3. Seed Route & Schedule
        if Schedule.objects.count() == 0:
            Schedule.objects.create(
                schedule_id=301,
                train_name="Vande Bharat Express",
                source="Chennai",
                destination="Bangalore",
                departure_date="2026-08-15",
                departure_time="06:00",
                arrival_date="2026-08-15",
                arrival_time="10:30",
                fare=1200.00
            )
            Schedule.objects.create(
                schedule_id=302,
                train_name="Rajdhani Express",
                source="Delhi",
                destination="Mumbai",
                departure_date="2026-08-16",
                departure_time="16:55",
                arrival_date="2026-08-17",
                arrival_time="08:35",
                fare=2400.00
            )
            Schedule.objects.create(
                schedule_id=303,
                train_name="Shatabdi Express",
                source="Delhi",
                destination="Bhopal",
                departure_date="2026-08-15",
                departure_time="06:00",
                arrival_date="2026-08-15",
                arrival_time="14:40",
                fare=1050.00
            )
            Schedule.objects.create(
                schedule_id=304,
                train_name="Deccan Queen",
                source="Pune",
                destination="Mumbai",
                departure_date="2026-08-18",
                departure_time="07:15",
                arrival_date="2026-08-18",
                arrival_time="10:25",
                fare=450.00
            )
            # Add reverse schedules or next day schedules
            Schedule.objects.create(
                schedule_id=305,
                train_name="Vande Bharat Express",
                source="Bangalore",
                destination="Chennai",
                departure_date="2026-08-16",
                departure_time="14:30",
                arrival_date="2026-08-16",
                arrival_time="19:00",
                fare=1200.00
            )
            print("Seeded Schedules successfully.")

        # 4. Seed Bookings
        if Booking.objects.count() == 0:
            Booking.objects.create(
                booking_id=401,
                passenger_name="Rahul Sharma",
                train_name="Vande Bharat Express",
                journey_date="2026-08-15",
                source="Chennai",
                destination="Bangalore",
                coach_type="Chair Car",
                seat_number="C5-18",
                total_fare=1200.00,
                booking_status="Confirmed"
            )
            print("Seeded Bookings successfully.")

        # 5. Seed Payments
        if Payment.objects.count() == 0:
            Payment.objects.create(
                payment_id=501,
                booking_id=401,
                passenger_name="Rahul Sharma",
                amount=1200.00,
                payment_method="UPI",
                payment_status="Success",
                transaction_id="TXN987654321",
                payment_date="2026-08-10"
            )
            print("Seeded Payments successfully.")
