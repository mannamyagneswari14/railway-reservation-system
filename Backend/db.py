from django.db import models

class Passenger(models.Model):
    passenger_id = models.IntegerField(primary_key=True, blank=True)
    full_name = models.CharField(max_length=100)
    email = models.EmailField(unique=True)
    phone = models.CharField(max_length=15)
    gender = models.CharField(max_length=10)
    age = models.IntegerField()
    address = models.TextField()
    password = models.CharField(max_length=100)

    def save(self, *args, **kwargs):
        if not self.passenger_id:
            max_id = Passenger.objects.all().aggregate(models.Max('passenger_id'))['passenger_id__max']
            self.passenger_id = max_id + 1 if max_id else 101
        super().save(*args, **kwargs)

    def __str__(self):
        return self.full_name


class Train(models.Model):
    train_id = models.IntegerField(primary_key=True, blank=True)
    train_name = models.CharField(max_length=100)
    train_number = models.CharField(max_length=20, unique=True)
    train_type = models.CharField(max_length=50)  # Express, Superfast, Passenger, Rajdhani, Shatabdi, Vande Bharat
    total_seats = models.IntegerField()
    source = models.CharField(max_length=100)
    destination = models.CharField(max_length=100)

    def save(self, *args, **kwargs):
        if not self.train_id:
            max_id = Train.objects.all().aggregate(models.Max('train_id'))['train_id__max']
            self.train_id = max_id + 1 if max_id else 201
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.train_name} ({self.train_number})"


class Schedule(models.Model):
    schedule_id = models.IntegerField(primary_key=True, blank=True)
    train_name = models.CharField(max_length=100)
    source = models.CharField(max_length=100)
    destination = models.CharField(max_length=100)
    departure_date = models.DateField()
    departure_time = models.TimeField()
    arrival_date = models.DateField()
    arrival_time = models.TimeField()
    fare = models.DecimalField(max_digits=10, decimal_places=2)

    def save(self, *args, **kwargs):
        if not self.schedule_id:
            max_id = Schedule.objects.all().aggregate(models.Max('schedule_id'))['schedule_id__max']
            self.schedule_id = max_id + 1 if max_id else 301
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.train_name} : {self.source} -> {self.destination}"


class Booking(models.Model):
    booking_id = models.IntegerField(primary_key=True, blank=True)
    passenger_name = models.CharField(max_length=100)
    train_name = models.CharField(max_length=100)
    journey_date = models.DateField()
    source = models.CharField(max_length=100)
    destination = models.CharField(max_length=100)
    coach_type = models.CharField(max_length=50)  # Sleeper, AC 3 Tier, AC 2 Tier, AC First Class, Chair Car
    seat_number = models.CharField(max_length=20)
    total_fare = models.DecimalField(max_digits=10, decimal_places=2)
    booking_status = models.CharField(max_length=50)  # Confirmed, RAC, Waiting List, Cancelled

    def save(self, *args, **kwargs):
        if not self.booking_id:
            max_id = Booking.objects.all().aggregate(models.Max('booking_id'))['booking_id__max']
            self.booking_id = max_id + 1 if max_id else 401
        super().save(*args, **kwargs)

    def __str__(self):
        return f"Booking {self.booking_id} - {self.passenger_name}"


class Payment(models.Model):
    payment_id = models.IntegerField(primary_key=True, blank=True)
    booking_id = models.IntegerField()
    passenger_name = models.CharField(max_length=100)
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    payment_method = models.CharField(max_length=50)  # UPI, Credit Card, Debit Card, Net Banking, Wallet
    payment_status = models.CharField(max_length=50)  # Success, Pending, Failed
    transaction_id = models.CharField(max_length=100, unique=True)
    payment_date = models.DateField()

    def save(self, *args, **kwargs):
        if not self.payment_id:
            max_id = Payment.objects.all().aggregate(models.Max('payment_id'))['payment_id__max']
            self.payment_id = max_id + 1 if max_id else 501
        super().save(*args, **kwargs)

    def __str__(self):
        return f"Payment {self.payment_id} - {self.payment_status}"
