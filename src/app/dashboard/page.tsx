"use client";

import { useEffect, useState } from "react";
import {
  Calendar,
  MapPin,
  Plane,
  Hotel,
  Clock,
  Plus,
  X,
  Loader2,
} from "lucide-react";

interface Location {
  name: string;
  country: string;
  state?: string;
}

interface Trip {
  id: string;
  name: string;
  city: string;
  country: string;
  startDate: string;
  endDate: string;
  flights: number;
  hotels: number;
}

interface Activity {
  id: string;
  type: "flight" | "hotel";
  title: string;
  description: string;
  date: string;
}

export default function Dashboard() {
  const [isLoading, setIsLoading] = useState(true);
  const [userName, setUserName] = useState("");
  const [trips, setTrips] = useState<Trip[]>([]);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [isAddingTrip, setIsAddingTrip] = useState(false);
  const [newTrip, setNewTrip] = useState({
    name: "",
    city: "",
    country: "",
    startDate: "",
    endDate: "",
  });
  const [citySuggestions, setCitySuggestions] = useState<Location[]>([]);
  const [showCitySuggestions, setShowCitySuggestions] = useState(false);
  const [isLoadingCities, setIsLoadingCities] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      setIsLoading(true);
      try {
        setUserName("User");
        await new Promise((resolve) => setTimeout(resolve, 1000));
      } finally {
        setIsLoading(false);
      }
    };
    checkAuth();
  }, []);

  const searchCities = async (query: string) => {
    if (query.length < 2) {
      setCitySuggestions([]);
      return;
    }

    setIsLoadingCities(true);
    try {
      const response = await fetch(
        `https://api.openweathermap.org/geo/1.0/direct?q=${query}&limit=5&appid=${process.env.NEXT_PUBLIC_OPENWEATHER_API_KEY}`
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (Array.isArray(data)) {
        setCitySuggestions(data);
      } else {
        setCitySuggestions([]);
      }
    } catch (error) {
      console.error("Error fetching cities:", error);
      setCitySuggestions([]);
    } finally {
      setIsLoadingCities(false);
    }
  };

  const handleCitySelect = (location: Location) => {
    setNewTrip({
      ...newTrip,
      city: location.name,
      country: location.country,
    });
    setShowCitySuggestions(false);
  };

  const handleAddTrip = () => {
    if (
      newTrip.name &&
      newTrip.city &&
      newTrip.country &&
      newTrip.startDate &&
      newTrip.endDate
    ) {
      const trip: Trip = {
        id: Date.now().toString(),
        name: newTrip.name,
        city: newTrip.city,
        country: newTrip.country,
        startDate: newTrip.startDate,
        endDate: newTrip.endDate,
        flights: 0,
        hotels: 0,
      };
      setTrips([...trips, trip]);
      setNewTrip({
        name: "",
        city: "",
        country: "",
        startDate: "",
        endDate: "",
      });
      setIsAddingTrip(false);
    }
  };

  const handleAddActivity = (type: "flight" | "hotel", tripId: string) => {
    const trip = trips.find((t) => t.id === tripId);
    if (trip) {
      const activity: Activity = {
        id: Date.now().toString(),
        type,
        title: `${type === "flight" ? "Flight" : "Hotel"} Added`,
        description: `${type === "flight" ? "Flight" : "Hotel"} for ${
          trip.name
        }`,
        date: new Date().toISOString(),
      };
      setActivities([activity, ...activities]);

      setTrips(
        trips.map((t) =>
          t.id === tripId
            ? {
                ...t,
                [type === "flight" ? "flights" : "hotels"]:
                  t[type === "flight" ? "flights" : "hotels"] + 1,
              }
            : t
        )
      );
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 text-[var(--nomadoo-primary)] animate-spin" />
      </div>
    );
  }

  return (
    <div className="dashboardContainer">
      <header className="dashboardHeader">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-[var(--nomadoo-primary)] to-blue-600 bg-clip-text text-transparent">
            Welcome to Your Personal Area
          </h1>
          <p className="text-gray-600 mt-2">
            Manage your trips and travel plans
          </p>
        </div>
        <div className="userInfo">
          <span className="text-lg font-medium">
            Hello, {userName || "User"}
          </span>
        </div>
      </header>

      <main className="space-y-6">
        <section className="dashboardSection">
          <h2 className="text-2xl font-semibold mb-6">Quick Overview</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-50 rounded-lg">
                  <Plane className="w-5 h-5 text-[var(--nomadoo-primary)]" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Upcoming Flights</p>
                  <p className="text-xl font-semibold text-[var(--nomadoo-primary)]">
                    {trips.reduce((acc, trip) => acc + trip.flights, 0)}
                  </p>
                </div>
              </div>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-50 rounded-lg">
                  <Hotel className="w-5 h-5 text-emerald-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Booked Stays</p>
                  <p className="text-xl font-semibold text-emerald-600">
                    {trips.reduce((acc, trip) => acc + trip.hotels, 0)}
                  </p>
                </div>
              </div>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-50 rounded-lg">
                  <MapPin className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Saved Places</p>
                  <p className="text-xl font-semibold text-purple-600">0</p>
                </div>
              </div>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-amber-50 rounded-lg">
                  <Clock className="w-5 h-5 text-amber-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Active Trips</p>
                  <p className="text-xl font-semibold text-amber-600">
                    {trips.length}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="dashboardSection">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-semibold">Upcoming Trips</h2>
            <button
              onClick={() => setIsAddingTrip(true)}
              className="flex items-center gap-2 text-[var(--nomadoo-primary)] hover:text-[#005c8e] transition-colors duration-200 bg-blue-50 px-4 py-2 rounded-full"
            >
              <Plus className="w-4 h-4" />
              <span>New Trip</span>
            </button>
          </div>

          {isAddingTrip && (
            <div className="mb-6 p-4 bg-white rounded-lg shadow-sm border border-gray-100">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">Add New Trip</h3>
                <button
                  onClick={() => setIsAddingTrip(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Trip Name
                  </label>
                  <input
                    type="text"
                    value={newTrip.name}
                    onChange={(e) =>
                      setNewTrip({ ...newTrip, name: e.target.value })
                    }
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[var(--nomadoo-primary)] focus:border-transparent"
                    placeholder="e.g., Paris Adventure"
                  />
                </div>
                <div className="relative">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    City and Country
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={newTrip.city}
                      onChange={(e) => {
                        const value = e.target.value;
                        setNewTrip({ ...newTrip, city: value });
                        searchCities(value);
                        setShowCitySuggestions(true);
                      }}
                      onFocus={() => {
                        if (newTrip.city.length >= 2) {
                          setShowCitySuggestions(true);
                        }
                      }}
                      onBlur={() => {
                        setTimeout(() => {
                          setShowCitySuggestions(false);
                        }, 200);
                      }}
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[var(--nomadoo-primary)] focus:border-transparent"
                      placeholder="Start typing a city name..."
                    />
                    {isLoadingCities && (
                      <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                        <Loader2 className="w-4 h-4 animate-spin text-gray-400" />
                      </div>
                    )}
                  </div>
                  {showCitySuggestions && citySuggestions.length > 0 && (
                    <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-auto">
                      {citySuggestions.map((location, index) => (
                        <button
                          key={`${location.name}-${index}`}
                          onClick={() => handleCitySelect(location)}
                          className="w-full px-4 py-2 text-left hover:bg-gray-50 focus:bg-gray-50 focus:outline-none"
                        >
                          <div className="flex items-center">
                            <MapPin className="w-4 h-4 text-gray-400 mr-2" />
                            <div>
                              <div className="font-medium">{location.name}</div>
                              <div className="text-sm text-gray-500">
                                {location.country}
                                {location.state ? `, ${location.state}` : ""}
                              </div>
                            </div>
                          </div>
                        </button>
                      ))}
                    </div>
                  )}
                  {showCitySuggestions &&
                    citySuggestions.length === 0 &&
                    !isLoadingCities && (
                      <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg p-2 text-sm text-gray-500">
                        No cities found
                      </div>
                    )}
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Start Date
                    </label>
                    <input
                      type="date"
                      value={newTrip.startDate}
                      onChange={(e) =>
                        setNewTrip({ ...newTrip, startDate: e.target.value })
                      }
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[var(--nomadoo-primary)] focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      End Date
                    </label>
                    <input
                      type="date"
                      value={newTrip.endDate}
                      onChange={(e) =>
                        setNewTrip({ ...newTrip, endDate: e.target.value })
                      }
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[var(--nomadoo-primary)] focus:border-transparent"
                    />
                  </div>
                </div>
                <button
                  onClick={handleAddTrip}
                  className="w-full bg-[var(--nomadoo-primary)] text-white py-2 rounded-md hover:bg-[#005c8e] transition-colors duration-200"
                >
                  Add Trip
                </button>
              </div>
            </div>
          )}

          <div className="tripsGrid">
            {trips.map((trip) => (
              <div
                key={trip.id}
                className="tripCard hover:shadow-md transition-all duration-300"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h3>{trip.name}</h3>
                    <p className="text-sm text-gray-600">
                      {trip.city}, {trip.country}
                    </p>
                    <p className="text-sm text-gray-600">
                      {new Date(trip.startDate).toLocaleDateString()} -{" "}
                      {new Date(trip.endDate).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="p-2 bg-blue-50 rounded-lg">
                    <Calendar className="w-5 h-5 text-[var(--nomadoo-primary)]" />
                  </div>
                </div>
                <div className="mt-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Plane className="w-4 h-4" />
                      <span>{trip.flights} Flights</span>
                    </div>
                    <button
                      onClick={() => handleAddActivity("flight", trip.id)}
                      className="text-[var(--nomadoo-primary)] hover:text-[#005c8e] text-sm"
                    >
                      + Add Flight
                    </button>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Hotel className="w-4 h-4" />
                      <span>{trip.hotels} Hotels</span>
                    </div>
                    <button
                      onClick={() => handleAddActivity("hotel", trip.id)}
                      className="text-[var(--nomadoo-primary)] hover:text-[#005c8e] text-sm"
                    >
                      + Add Hotel
                    </button>
                  </div>
                </div>
              </div>
            ))}
            {trips.length === 0 && (
              <div className="tripCard text-center py-8">
                <p className="text-gray-500">
                  No trips added yet. Click "New Trip" to get started!
                </p>
              </div>
            )}
          </div>
        </section>

        <section className="dashboardSection">
          <h2 className="text-2xl font-semibold mb-6">Recent Activity</h2>
          <div className="space-y-4">
            {activities.map((activity) => (
              <div
                key={activity.id}
                className="flex items-center gap-4 p-4 bg-white rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300"
              >
                <div
                  className={`p-2 ${
                    activity.type === "flight" ? "bg-blue-50" : "bg-green-50"
                  } rounded-lg`}
                >
                  {activity.type === "flight" ? (
                    <Plane className="w-5 h-5 text-[var(--nomadoo-primary)]" />
                  ) : (
                    <Hotel className="w-5 h-5 text-emerald-600" />
                  )}
                </div>
                <div>
                  <p className="font-medium">{activity.title}</p>
                  <p className="text-sm text-gray-600">
                    {activity.description}
                  </p>
                </div>
              </div>
            ))}
            {activities.length === 0 && (
              <div className="text-center py-8">
                <p className="text-gray-500">No recent activities</p>
              </div>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}
