"use client";

import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { useEffect, useRef, useState, useCallback } from "react";
import {
  Search,
  Navigation,
  Info,
  Loader2,
  Utensils,
  TreePine,
  Hotel,
  ShoppingBag,
  Landmark,
  Fuel,
  Pill,
  ShoppingCart,
  CreditCard,
  ChevronUp,
  ChevronDown,
  Compass,
} from "lucide-react";
import SearchComponent from "./Search";

mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN || "";

interface Place {
  id: string;
  name: string;
  type: string;
  coordinates: [number, number];
  category?: string;
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

interface Category {
  id: string;
  label: string;
  icon: any;
}

const CATEGORIES: Category[] = [
  { id: "restaurant", label: "Restaurants", icon: Utensils },
  { id: "park", label: "Parks", icon: TreePine },
  { id: "hotel", label: "Hotels", icon: Hotel },
  { id: "shop", label: "Shops", icon: ShoppingBag },
  { id: "museum", label: "Museums", icon: Landmark },
  { id: "gas_station", label: "Gas Stations", icon: Fuel },
  { id: "pharmacy", label: "Pharmacies", icon: Pill },
  { id: "supermarket", label: "Supermarkets", icon: ShoppingCart },
  { id: "atm", label: "ATMs", icon: CreditCard },
];

const LoadingOverlay = () => (
  <div className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center z-50">
    <div className="flex flex-col items-center gap-2">
      <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
      <p className="text-gray-600">Getting your location...</p>
    </div>
  </div>
);

const NavigationControls = ({
  map,
  currentLocation,
}: {
  map: mapboxgl.Map | null;
  currentLocation: CurrentLocation | null;
}) => (
  <div className="absolute top-20 right-4 z-10 flex flex-col gap-2">
    <button
      onClick={() => map?.zoomIn()}
      className="bg-white p-2.5 rounded-lg shadow-md hover:bg-gray-100 flex items-center justify-center"
    >
      <span className="text-xl font-semibold text-gray-600">+</span>
    </button>
    <button
      onClick={() => map?.zoomOut()}
      className="bg-white p-2.5 rounded-lg shadow-md hover:bg-gray-100 flex items-center justify-center"
    >
      <span className="text-xl font-semibold text-gray-600">-</span>
    </button>
    <button
      onClick={() => map?.resetNorth()}
      className="bg-white p-2.5 rounded-lg shadow-md hover:bg-gray-100 flex items-center justify-center"
    >
      <Compass className="w-5 h-5 text-gray-600" />
    </button>
  </div>
);

const LocationButton = ({
  currentLocation,
  map,
}: {
  currentLocation: CurrentLocation | null;
  map: mapboxgl.Map | null;
}) => (
  <button
    onClick={() => {
      if (currentLocation && map) {
        map.flyTo({
          center: currentLocation.coordinates,
          zoom: 14,
          duration: 2000,
          curve: 1.5,
        });
      }
    }}
    className="bg-white p-2.5 rounded-lg shadow-md hover:bg-gray-100 flex items-center justify-center"
  >
    <Navigation className="w-5 h-5 text-gray-600" />
  </button>
);

const CategoriesPanel = ({
  isPanelVisible,
  isPanelExpanded,
  setIsPanelVisible,
  setIsPanelExpanded,
  selectedCategory,
  setSelectedCategory,
  currentLocation,
  searchNearbyPlaces,
}: {
  isPanelVisible: boolean;
  isPanelExpanded: boolean;
  setIsPanelVisible: (visible: boolean) => void;
  setIsPanelExpanded: (expanded: boolean) => void;
  selectedCategory: string | null;
  setSelectedCategory: (category: string | null) => void;
  currentLocation: CurrentLocation | null;
  searchNearbyPlaces: (category: string, coordinates: [number, number]) => void;
}) => (
  <div
    className={`absolute bottom-0 left-0 right-0 z-10 transition-all duration-300 ease-in-out ${
      isPanelVisible ? "translate-y-0" : "translate-y-full"
    }`}
  >
    <div className="bg-white rounded-t-2xl shadow-lg">
      <div
        className="w-full h-1 bg-gray-200 rounded-full mx-auto my-2 cursor-pointer"
        onClick={() => {
          if (isPanelExpanded) {
            setIsPanelExpanded(false);
          } else {
            setIsPanelVisible(false);
          }
        }}
      />
      <div className="px-4 pb-2 flex justify-between items-center">
        <h3 className="font-semibold text-lg">What are you looking for?</h3>
        <button
          onClick={() => {
            if (isPanelExpanded) {
              setIsPanelExpanded(false);
            } else {
              setIsPanelVisible(false);
            }
          }}
          className="p-2 rounded-full hover:bg-gray-100"
        >
          {isPanelExpanded ? (
            <ChevronDown className="w-5 h-5 text-gray-600" />
          ) : (
            <ChevronUp className="w-5 h-5 text-gray-600" />
          )}
        </button>
      </div>
      <div
        className={`px-4 pb-4 transition-all duration-300 ease-in-out ${
          isPanelExpanded ? "max-h-[60vh]" : "max-h-[200px]"
        } overflow-y-auto`}
      >
        <div className="grid grid-cols-3 gap-3">
          {CATEGORIES.map((category) => (
            <button
              key={category.id}
              onClick={() => {
                setSelectedCategory(category.id);
                if (currentLocation) {
                  searchNearbyPlaces(category.id, currentLocation.coordinates);
                }
              }}
              className={`flex flex-col items-center gap-2 p-3 rounded-xl ${
                selectedCategory === category.id
                  ? "bg-blue-500 text-white"
                  : "bg-gray-50 hover:bg-gray-100"
              }`}
            >
              <category.icon className="w-6 h-6" />
              <span className="text-xs text-center">{category.label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  </div>
);

export default function Map() {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
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
  const marker = useRef<mapboxgl.Marker | null>(null);
  const modalRef = useRef<HTMLDivElement>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [places, setPlaces] = useState<Place[]>([]);
  const [isLoadingPlaces, setIsLoadingPlaces] = useState(false);
  const [isPanelExpanded, setIsPanelExpanded] = useState(false);
  const [isPanelVisible, setIsPanelVisible] = useState(false);

  const searchNearbyPlaces = useCallback(
    async (category: string, coordinates: [number, number]) => {
      if (!map.current) return;

      setIsLoadingPlaces(true);
      try {
        const response = await fetch(
          `https://api.mapbox.com/geocoding/v5/mapbox.places/${category}.json?proximity=${coordinates[0]},${coordinates[1]}&types=poi&access_token=${mapboxgl.accessToken}`
        );
        const data = await response.json();

        if (data.features) {
          const newPlaces = data.features.map((feature: any) => ({
            id: feature.id,
            name: feature.text,
            type: feature.place_type[0],
            coordinates: feature.center,
            category: category,
          }));

          setPlaces(newPlaces);

          const source = map.current.getSource(
            "places"
          ) as mapboxgl.GeoJSONSource;
          if (source) {
            source.setData({
              type: "FeatureCollection",
              features: newPlaces.map((place: Place) => ({
                type: "Feature",
                geometry: {
                  type: "Point",
                  coordinates: place.coordinates,
                },
                properties: {
                  id: place.id,
                  name: place.name,
                  type: place.type,
                  category: place.category,
                },
              })),
            });
          }
        }
      } catch (error) {
        console.error("Error searching nearby places:", error);
      } finally {
        setIsLoadingPlaces(false);
      }
    },
    []
  );

  const initializeMap = useCallback(
    async (longitude: number, latitude: number) => {
      if (!mapContainer.current) return;

      try {
        map.current = new mapboxgl.Map({
          container: mapContainer.current,
          style: mapStyle,
          center: [longitude, latitude],
          zoom: 14,
        });

        map.current.on("load", () => {
          map.current?.addSource("places", {
            type: "geojson",
            data: {
              type: "FeatureCollection",
              features: [],
            },
          });

          map.current?.addLayer({
            id: "places",
            type: "circle",
            source: "places",
            paint: {
              "circle-radius": 8,
              "circle-color": "#FF0000",
              "circle-stroke-width": 2,
              "circle-stroke-color": "#FFFFFF",
            },
          });

          map.current?.on("click", "places", (e) => {
            if (!e.features) return;
            const feature = e.features[0];
            const place = places.find((p) => p.id === feature.properties?.id);
            if (place) {
              setSelectedPlace(place);
            }
          });

          map.current?.on("click", () => {
            setIsPanelVisible(false);
            setIsPanelExpanded(false);
            setActiveModal(null);
          });

          map.current?.on("mouseenter", "places", () => {
            if (map.current) {
              map.current.getCanvas().style.cursor = "pointer";
            }
          });
          map.current?.on("mouseleave", "places", () => {
            if (map.current) {
              map.current.getCanvas().style.cursor = "";
            }
          });
        });

        map.current.flyTo({
          center: [longitude, latitude],
          zoom: 14,
          essential: true,
          duration: 2000,
          curve: 1.5,
        });

        marker.current = new mapboxgl.Marker({ color: "#FF0000" })
          .setLngLat([longitude, latitude])
          .addTo(map.current);

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
            city:
              context.find((c: any) => c.id.startsWith("place"))?.text || "",
            state:
              context.find((c: any) => c.id.startsWith("region"))?.text || "",
            country:
              context.find((c: any) => c.id.startsWith("country"))?.text || "",
          });
        }
      } catch (error) {
        console.error("Error initializing map:", error);
      }
    },
    [mapStyle, places]
  );

  const handleSearch = useCallback(async (query: string) => {
    if (!query.trim() || !map.current) return;

    try {
      const response = await fetch(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(
          query
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
    } catch (error) {
      console.error("Error searching location:", error);
    }
  }, []);

  const handleSuggestionClick = useCallback((suggestion: SearchSuggestion) => {
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
  }, []);

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
  }, [initializeMap]);

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
      {isLoading && <LoadingOverlay />}

      <button
        onClick={() => {
          setActiveModal(activeModal === "search" ? null : "search");
          setIsPanelVisible(false);
        }}
        className="absolute top-4 left-4 z-10 bg-white px-4 py-2.5 rounded-lg shadow-md hover:bg-gray-100 flex items-center gap-2"
      >
        <Search className="w-5 h-5 text-gray-600" />
        <span className="text-gray-600">Search</span>
      </button>

      <div className="absolute top-4 right-4 z-10">
        <LocationButton currentLocation={currentLocation} map={map.current} />
      </div>

      <NavigationControls map={map.current} currentLocation={currentLocation} />

      {isLoadingPlaces && (
        <div className="absolute top-20 right-4 z-10 bg-white p-2 rounded-lg shadow-md">
          <Loader2 className="w-5 h-5 text-blue-500 animate-spin" />
        </div>
      )}

      <SearchComponent
        onSuggestionClick={handleSuggestionClick}
        onSearch={handleSearch}
        activeModal={activeModal}
        setActiveModal={setActiveModal}
      />

      <CategoriesPanel
        isPanelVisible={isPanelVisible}
        isPanelExpanded={isPanelExpanded}
        setIsPanelVisible={setIsPanelVisible}
        setIsPanelExpanded={setIsPanelExpanded}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        currentLocation={currentLocation}
        searchNearbyPlaces={searchNearbyPlaces}
      />

      {!isPanelVisible && (
        <button
          onClick={() => setIsPanelVisible(true)}
          className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-white px-6 py-3 rounded-full shadow-lg hover:bg-gray-50 z-10 flex items-center gap-2"
        >
          <Search className="w-5 h-5 text-gray-600" />
          <span className="text-gray-600">What are you looking for?</span>
        </button>
      )}

      {selectedPlace && (
        <div className="absolute bottom-4 left-4 right-4 z-10 bg-white p-4 rounded-lg shadow-md">
          <div className="flex items-center gap-2">
            <Info className="w-5 h-5 text-blue-500" />
            <div>
              <h3 className="font-semibold">{selectedPlace.name}</h3>
              <p className="text-sm text-gray-500">
                {selectedPlace.type}{" "}
                {selectedPlace.category && `• ${selectedPlace.category}`}
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="w-full h-full rounded-lg" ref={mapContainer} />
    </div>
  );
}
