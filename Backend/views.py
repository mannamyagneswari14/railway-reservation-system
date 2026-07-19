from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from django.db import models
from .models import Passenger, Train, Schedule, Booking, Payment
from .serializers import (
    PassengerSerializer,
    TrainSerializer,
    ScheduleSerializer,
    BookingSerializer,
    PaymentSerializer
)

# =====================================================================
# PASSENGER MANAGEMENT APIs
# =====================================================================

@api_view(['POST'])
def add_passenger(request):
    serializer = PassengerSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET'])
def get_passengers(request):
    passengers = Passenger.objects.all()
    serializer = PassengerSerializer(passengers, many=True)
    return Response(serializer.data)


@api_view(['PUT'])
def update_passenger(request, pk):
    try:
        passenger = Passenger.objects.get(pk=pk)
    except Passenger.DoesNotExist:
        return Response({"error": "Passenger not found"}, status=status.HTTP_404_NOT_FOUND)
    
    serializer = PassengerSerializer(passenger, data=request.data, partial=True)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['DELETE'])
def delete_passenger(request, pk):
    try:
        passenger = Passenger.objects.get(pk=pk)
    except Passenger.DoesNotExist:
        return Response({"error": "Passenger not found"}, status=status.HTTP_404_NOT_FOUND)
    
    passenger.delete()
    return Response({"message": "Passenger deleted successfully"}, status=status.HTTP_200_OK)


@api_view(['POST'])
def login_passenger(request):
    email = request.data.get('email')
    password = request.data.get('password')
    if not email or not password:
        return Response({"error": "Email and password are required"}, status=status.HTTP_400_BAD_REQUEST)
    
    try:
        passenger = Passenger.objects.get(email=email, password=password)
        serializer = PassengerSerializer(passenger)
        return Response({
            "message": "Login successful",
            "user": serializer.data
        }, status=status.HTTP_200_OK)
    except Passenger.DoesNotExist:
        return Response({"error": "Invalid email or password"}, status=status.HTTP_401_UNAUTHORIZED)


# =====================================================================
# TRAIN MANAGEMENT APIs
# =====================================================================

@api_view(['POST'])
def add_train(request):
    serializer = TrainSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET'])
def get_trains(request):
    trains = Train.objects.all()
    serializer = TrainSerializer(trains, many=True)
    return Response(serializer.data)


@api_view(['PUT'])
def update_train(request, pk):
    try:
        train = Train.objects.get(pk=pk)
    except Train.DoesNotExist:
        return Response({"error": "Train not found"}, status=status.HTTP_404_NOT_FOUND)
    
    serializer = TrainSerializer(train, data=request.data, partial=True)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['DELETE'])
def delete_train(request, pk):
    try:
        train = Train.objects.get(pk=pk)
    except Train.DoesNotExist:
        return Response({"error": "Train not found"}, status=status.HTTP_404_NOT_FOUND)
    
    train.delete()
    return Response({"message": "Train deleted successfully"}, status=status.HTTP_200_OK)


# =====================================================================
# ROUTE & SCHEDULE MANAGEMENT APIs
# =====================================================================

@api_view(['POST'])
def add_schedule(request):
    serializer = ScheduleSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET'])
def get_schedules(request):
    schedules = Schedule.objects.all()
    
    # Optional filtering by source, destination, date
    source = request.query_params.get('source')
    destination = request.query_params.get('destination')
    departure_date = request.query_params.get('departure_date')
    
    if source:
        schedules = schedules.filter(source__iexact=source)
    if destination:
        schedules = schedules.filter(destination__iexact=destination)
    if departure_date:
        schedules = schedules.filter(departure_date=departure_date)
        
    serializer = ScheduleSerializer(schedules, many=True)
    return Response(serializer.data)


@api_view(['PUT'])
def update_schedule(request, pk):
    try:
        schedule = Schedule.objects.get(pk=pk)
    except Schedule.DoesNotExist:
        return Response({"error": "Schedule not found"}, status=status.HTTP_404_NOT_FOUND)
    
    serializer = ScheduleSerializer(schedule, data=request.data, partial=True)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['DELETE'])
def delete_schedule(request, pk):
    try:
        schedule = Schedule.objects.get(pk=pk)
    except Schedule.DoesNotExist:
        return Response({"error": "Schedule not found"}, status=status.HTTP_404_NOT_FOUND)
    
    schedule.delete()
    return Response({"message": "Schedule deleted successfully"}, status=status.HTTP_200_OK)


# =====================================================================
# TICKET RESERVATION MANAGEMENT APIs
# =====================================================================

@api_view(['POST'])
def add_booking(request):
    serializer = BookingSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET'])
def get_bookings(request):
    bookings = Booking.objects.all()
    
    # Optional filtering by passenger name
    passenger_name = request.query_params.get('passenger_name')
    if passenger_name:
        bookings = bookings.filter(passenger_name=passenger_name)
        
    serializer = BookingSerializer(bookings, many=True)
    return Response(serializer.data)


@api_view(['PUT'])
def update_booking(request, pk):
    try:
        booking = Booking.objects.get(pk=pk)
    except Booking.DoesNotExist:
        return Response({"error": "Booking not found"}, status=status.HTTP_404_NOT_FOUND)
    
    serializer = BookingSerializer(booking, data=request.data, partial=True)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['DELETE'])
def delete_booking(request, pk):
    try:
        booking = Booking.objects.get(pk=pk)
    except Booking.DoesNotExist:
        return Response({"error": "Booking not found"}, status=status.HTTP_404_NOT_FOUND)
    
    booking.delete()
    return Response({"message": "Booking deleted successfully"}, status=status.HTTP_200_OK)


# =====================================================================
# PAYMENT MANAGEMENT APIs
# =====================================================================

@api_view(['POST'])
def add_payment(request):
    serializer = PaymentSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET'])
def get_payments(request):
    payments = Payment.objects.all()
    
    # Optional filtering by passenger name
    passenger_name = request.query_params.get('passenger_name')
    if passenger_name:
        payments = payments.filter(passenger_name=passenger_name)
        
    serializer = PaymentSerializer(payments, many=True)
    return Response(serializer.data)


@api_view(['PUT'])
def update_payment(request, pk):
    try:
        payment = Payment.objects.get(pk=pk)
    except Payment.DoesNotExist:
        return Response({"error": "Payment not found"}, status=status.HTTP_404_NOT_FOUND)
    
    serializer = PaymentSerializer(payment, data=request.data, partial=True)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['DELETE'])
def delete_payment(request, pk):
    try:
        payment = Payment.objects.get(pk=pk)
    except Payment.DoesNotExist:
        return Response({"error": "Payment not found"}, status=status.HTTP_404_NOT_FOUND)
    
    payment.delete()
    return Response({"message": "Payment deleted successfully"}, status=status.HTTP_200_OK)
