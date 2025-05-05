"use client";

import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { useEffect, useRef, useState } from "react";
import {
  Search,
  Navigation,
  Info,
  Settings,
  MapPin,
  Loader2,
} from "lucide-react";

mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN || "";

interface Place {
  id: string;
  name: string;
  type: string;
  coordinates: [number, number];
}

interface SearchSuggestion {
  id: string;
  text: string;
  place_name: string;
  center: [number, number];
}

interface CurrentLocation {
  coordinates: [number, number];
  address: string;
  city: string;
  state: string;
  country: string;
}

export default function Map() {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [suggestions, setSuggestions] = useState<SearchSuggestion[]>([]);
  const [currentLocation, setCurrentLocation] =
    useState<CurrentLocation | null>(null);
  const [selectedPlace, setSelectedPlace] = useState<Place | null>(null);
  const [mapStyle, setMapStyle] = useState(
    "mapbox://styles/mapbox/streets-v11"
  );
  const [activeModal, setActiveModal] = useState<
    "search" | "navigation" | "settings" | null
  >(null);
  const [isLoading, setIsLoading] = useState(true);
  const searchTimeout = useRef<NodeJS.Timeout | undefined>(undefined);
  const marker = useRef<mapboxgl.Marker | null>(null);
  const modalRef = useRef<HTMLDivElement>(null);

  const initializeMap = async (longitude: number, latitude: number) => {
    if (!mapContainer.current) return;

    try {
      map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: mapStyle,
        center: [longitude, latitude],
        zoom: 14,
      });

      map.current.addControl(new mapboxgl.NavigationControl(), "top-right");

      // current location marker
      marker.current = new mapboxgl.Marker({ color: "#FF0000" })
        .setLngLat([longitude, latitude])
        .addTo(map.current);

      // map events
      map.current.on("click", (e) => {
        const features = map.current?.queryRenderedFeatures(e.point);
        if (features && features.length > 0) {
          const place = features[0].properties;
          if (place) {
            setSelectedPlace({
              id: place.id,
              name: place.name,
              type: place.type,
              coordinates: [e.lngLat.lng, e.lngLat.lat],
            });
          }
        }
      });

      // current address information
      const response = await fetch(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${longitude},${latitude}.json?access_token=${mapboxgl.accessToken}`
      );
      const data = await response.json();

      if (data.features && data.features.length > 0) {
        const feature = data.features[0];
        const context = feature.context || [];

        setCurrentLocation({
          coordinates: [longitude, latitude],
          address: feature.text,
          city: context.find((c: any) => c.id.startsWith("place"))?.text || "",
          state:
            context.find((c: any) => c.id.startsWith("region"))?.text || "",
          country:
            context.find((c: any) => c.id.startsWith("country"))?.text || "",
        });
      }
    } catch (error) {
      console.error("Error initializing map:", error);
    }
  };

  useEffect(() => {
    const getCurrentLocation = () => {
      if (!navigator.geolocation) {
        console.error("Geolocation is not supported by your browser");
        setIsLoading(false);
        return;
      }

      const options = {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0,
      };

      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          initializeMap(longitude, latitude);
          setIsLoading(false);
        },
        (error) => {
          console.error("Error getting location:", error);
          setIsLoading(false);
          alert(
            "Unable to get your location. Please enable location services and try again."
          );
        },
        options
      );
    };

    getCurrentLocation();

    return () => {
      if (marker.current) {
        marker.current.remove();
      }
      if (map.current) {
        map.current.remove();
      }
    };
  }, [mapStyle]);

  const handleSearchInput = (value: string) => {
    setSearchQuery(value);

    if (searchTimeout.current) {
      clearTimeout(searchTimeout.current);
    }

    if (!value.trim()) {
      setSuggestions([]);
      return;
    }

    searchTimeout.current = setTimeout(async () => {
      try {
        const response = await fetch(
          `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(
            value
          )}.json?types=address,place,locality,neighborhood,poi&access_token=${
            mapboxgl.accessToken
          }`
        );
        const data = await response.json();

        if (data.features) {
          setSuggestions(
            data.features.map((feature: any) => ({
              id: feature.id,
              text: feature.text,
              place_name: feature.place_name,
              center: feature.center,
            }))
          );
        }
      } catch (error) {
        console.error("Error fetching suggestions:", error);
      }
    }, 300);
  };

  const handleSuggestionClick = (suggestion: SearchSuggestion) => {
    setSearchQuery(suggestion.place_name);
    setSuggestions([]);
    setActiveModal(null);

    if (map.current) {
      map.current.flyTo({
        center: suggestion.center,
        zoom: 14,
      });

      if (marker.current) {
        marker.current.remove();
      }

      marker.current = new mapboxgl.Marker()
        .setLngLat(suggestion.center)
        .addTo(map.current);
    }
  };

  const handleSearch = async () => {
    if (!searchQuery.trim() || !map.current) return;

    try {
      const response = await fetch(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(
          searchQuery
        )}.json?access_token=${mapboxgl.accessToken}`
      );
      const data = await response.json();

      if (data.features && data.features.length > 0) {
        const [lng, lat] = data.features[0].center;
        map.current.flyTo({
          center: [lng, lat],
          zoom: 14,
        });

        if (marker.current) {
          marker.current.remove();
        }

        marker.current = new mapboxgl.Marker()
          .setLngLat([lng, lat])
          .addTo(map.current);
      }

      setActiveModal(null);
      setSuggestions([]);
    } catch (error) {
      console.error("Error searching location:", error);
    }
  };

  const toggleMapStyle = () => {
    setMapStyle(
      mapStyle === "mapbox://styles/mapbox/streets-v11"
        ? "mapbox://styles/mapbox/satellite-v9"
        : "mapbox://styles/mapbox/streets-v11"
    );
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        modalRef.current &&
        !modalRef.current.contains(event.target as Node)
      ) {
        setActiveModal(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="relative w-full h-[calc(100vh-4rem)] mt-16">
      {isLoading && (
        <div className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center z-50">
          <div className="flex flex-col items-center gap-2">
            <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
            <p className="text-gray-600">Getting your location...</p>
          </div>
        </div>
      )}

      <div className="absolute top-4 left-4 z-10 flex flex-col gap-2">
        <button
          onClick={() =>
            setActiveModal(activeModal === "search" ? null : "search")
          }
          className="bg-white p-2 rounded-lg shadow-md hover:bg-gray-100"
        >
          <Search className="w-6 h-6 text-gray-600" />
        </button>
        <button
          onClick={() =>
            setActiveModal(activeModal === "navigation" ? null : "navigation")
          }
          className="bg-white p-2 rounded-lg shadow-md hover:bg-gray-100"
        >
          <Navigation className="w-6 h-6 text-gray-600" />
        </button>
        <button
          onClick={() =>
            setActiveModal(activeModal === "settings" ? null : "settings")
          }
          className="bg-white p-2 rounded-lg shadow-md hover:bg-gray-100"
        >
          <Settings className="w-6 h-6 text-gray-600" />
        </button>
      </div>

      {activeModal === "search" && (
        <div
          ref={modalRef}
          className="absolute top-4 left-16 z-10 bg-white p-4 rounded-lg shadow-md"
        >
          <div className="flex flex-col gap-2">
            <div className="flex gap-2">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => handleSearchInput(e.target.value)}
                placeholder="Search address..."
                className="px-3 py-2 border rounded-lg w-64"
              />
              <button
                onClick={handleSearch}
                className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
              >
                Search
              </button>
            </div>

            {suggestions.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-white rounded-lg shadow-lg max-h-60 overflow-y-auto">
                {suggestions.map((suggestion) => (
                  <div
                    key={suggestion.id}
                    onClick={() => handleSuggestionClick(suggestion)}
                    className="p-2 hover:bg-gray-100 cursor-pointer border-b last:border-b-0"
                  >
                    <p className="font-medium">{suggestion.text}</p>
                    <p className="text-sm text-gray-500">
                      {suggestion.place_name}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {activeModal === "navigation" && currentLocation && (
        <div
          ref={modalRef}
          className="absolute top-4 left-16 z-10 bg-white p-4 rounded-lg shadow-md"
        >
          <h3 className="font-semibold mb-2 flex items-center gap-2">
            <MapPin className="w-5 h-5 text-red-500" />
            Your Location
          </h3>
          <div className="space-y-2">
            <div className="p-2 bg-gray-50 rounded-lg">
              <p className="font-medium">{currentLocation.address}</p>
              <p className="text-sm text-gray-500">
                {currentLocation.city && `${currentLocation.city}, `}
                {currentLocation.state && `${currentLocation.state}, `}
                {currentLocation.country}
              </p>
            </div>
            <div className="text-sm text-gray-500">
              <p>Latitude: {currentLocation.coordinates[1].toFixed(6)}</p>
              <p>Longitude: {currentLocation.coordinates[0].toFixed(6)}</p>
            </div>
          </div>
        </div>
      )}

      {activeModal === "settings" && (
        <div
          ref={modalRef}
          className="absolute top-4 left-16 z-10 bg-white p-4 rounded-lg shadow-md"
        >
          <h3 className="font-semibold mb-2">Map Settings</h3>
          <button
            onClick={toggleMapStyle}
            className="w-full bg-gray-100 p-2 rounded-lg hover:bg-gray-200"
          >
            Toggle Map Style
          </button>
        </div>
      )}

      {selectedPlace && (
        <div className="absolute bottom-4 left-4 right-4 z-10 bg-white p-4 rounded-lg shadow-md">
          <div className="flex items-center gap-2">
            <Info className="w-5 h-5 text-blue-500" />
            <div>
              <h3 className="font-semibold">{selectedPlace.name}</h3>
              <p className="text-sm text-gray-500">{selectedPlace.type}</p>
            </div>
          </div>
        </div>
      )}

      <div className="w-full h-full rounded-lg" ref={mapContainer} />
    </div>
  );
}
