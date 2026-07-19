from django.urls import path
from . import views

urlpatterns = [
    # Passenger Management
    path('passengers/add/', views.add_passenger, name='add_passenger'),
    path('passengers/', views.get_passengers, name='get_passengers'),
    path('passengers/update/<int:pk>/', views.update_passenger, name='update_passenger'),
    path('passengers/delete/<int:pk>/', views.delete_passenger, name='delete_passenger'),
    path('passengers/login/', views.login_passenger, name='login_passenger'),

    # Train Management
    path('trains/add/', views.add_train, name='add_train'),
    path('trains/', views.get_trains, name='get_trains'),
    path('trains/update/<int:pk>/', views.update_train, name='update_train'),
    path('trains/delete/<int:pk>/', views.delete_train, name='delete_train'),

    # Route & Schedule Management
    path('schedules/add/', views.add_schedule, name='add_schedule'),
    path('schedules/', views.get_schedules, name='get_schedules'),
    path('schedules/update/<int:pk>/', views.update_schedule, name='update_schedule'),
    path('schedules/delete/<int:pk>/', views.delete_schedule, name='delete_schedule'),

    # Ticket Reservation Management
    path('bookings/add/', views.add_booking, name='add_booking'),
    path('bookings/', views.get_bookings, name='get_bookings'),
    path('bookings/update/<int:pk>/', views.update_booking, name='update_booking'),
    path('bookings/delete/<int:pk>/', views.delete_booking, name='delete_booking'),

    # Payment Management
    path('payments/add/', views.add_payment, name='add_payment'),
    path('payments/', views.get_payments, name='get_payments'),
    path('payments/update/<int:pk>/', views.update_payment, name='update_payment'),
    path('payments/delete/<int:pk>/', views.delete_payment, name='delete_payment'),
]
