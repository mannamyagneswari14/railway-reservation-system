from rest_framework import serializers
from .models import Passenger, Train, Schedule, Booking, Payment

class PassengerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Passenger
        fields = '__all__'


class TrainSerializer(serializers.ModelSerializer):
    class Meta:
        model = Train
        fields = '__all__'


class ScheduleSerializer(serializers.ModelSerializer):
    # Format departure_time and arrival_time as HH:MM when serializing
    departure_time = serializers.TimeField(format='%H:%M')
    arrival_time = serializers.TimeField(format='%H:%M')

    class Meta:
        model = Schedule
        fields = '__all__'


class BookingSerializer(serializers.ModelSerializer):
    class Meta:
        model = Booking
        fields = '__all__'


class PaymentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Payment
        fields = '__all__'
