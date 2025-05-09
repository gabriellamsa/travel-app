"use client";

import { useState, useCallback, useRef } from "react";
import { Search as SearchIcon } from "lucide-react";

interface SearchSuggestion {
  id: string;
  text: string;
  place_name: string;
  center: [number, number];
}

interface SearchProps {
  onSuggestionClick: (suggestion: SearchSuggestion) => void;
  onSearch: (query: string) => void;
  activeModal: "search" | "navigation" | "settings" | null;
  setActiveModal: (modal: "search" | "navigation" | "settings" | null) => void;
}

export default function Search({
  onSuggestionClick,
  onSearch,
  activeModal,
  setActiveModal,
}: SearchProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [suggestions, setSuggestions] = useState<SearchSuggestion[]>([]);
  const searchTimeout = useRef<NodeJS.Timeout | null>(null);

  const handleSearchInput = useCallback(async (value: string) => {
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
            process.env.NEXT_PUBLIC_MAPBOX_TOKEN
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
        setSuggestions([]);
      }
    }, 300);
  }, []);

  const handleSearch = useCallback(() => {
    if (!searchQuery.trim()) return;
    onSearch(searchQuery);
    setSuggestions([]);
  }, [searchQuery, onSearch]);

  const handleSuggestionClick = useCallback(
    (suggestion: SearchSuggestion) => {
      onSuggestionClick(suggestion);
      setSearchQuery(suggestion.place_name);
      setSuggestions([]);
    },
    [onSuggestionClick]
  );

  return (
    <div
      className={`absolute top-0 left-0 h-full z-10 transition-all duration-300 ease-in-out ${
        activeModal === "search" ? "translate-x-0" : "-translate-x-full"
      }`}
    >
      <div className="bg-white h-full w-[350px] shadow-lg flex flex-col">
        <div
          className="w-full h-1 bg-gray-200 rounded-full mx-auto my-2 cursor-pointer"
          onClick={() => setActiveModal(null)}
        />
        <div className="px-4 pb-4 flex-1 flex flex-col">
          <div className="flex gap-2 mb-4">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => handleSearchInput(e.target.value)}
              placeholder="Search address..."
              className="flex-1 px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              onClick={handleSearch}
              className="bg-blue-500 text-white px-6 py-3 rounded-xl hover:bg-blue-600 transition-colors flex items-center gap-2"
            >
              <SearchIcon size={18} />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto">
            {suggestions.map((suggestion) => (
              <div
                key={suggestion.id}
                onClick={() => handleSuggestionClick(suggestion)}
                className="p-3 hover:bg-gray-50 cursor-pointer border-b last:border-b-0"
              >
                <p className="font-medium">{suggestion.text}</p>
                <p className="text-sm text-gray-500">{suggestion.place_name}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
