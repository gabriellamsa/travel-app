"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { Search as SearchIcon, X, MapPin, Clock, History } from "lucide-react";

interface SearchSuggestion {
  id: string;
  text: string;
  place_name: string;
  center: [number, number];
  type?: string;
  relevance?: number;
}

interface SearchProps {
  onSuggestionClick: (suggestion: SearchSuggestion) => void;
  onSearch: (query: string) => void;
  activeModal: "search" | "navigation" | "settings" | null;
  setActiveModal: (modal: "search" | "navigation" | "settings" | null) => void;
}

const MAX_RECENT_SEARCHES = 5;

export default function Search({
  onSuggestionClick,
  onSearch,
  activeModal,
  setActiveModal,
}: SearchProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [suggestions, setSuggestions] = useState<SearchSuggestion[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [recentSearches, setRecentSearches] = useState<SearchSuggestion[]>([]);
  const [showPlaceholder, setShowPlaceholder] = useState(true);
  const searchTimeout = useRef<NodeJS.Timeout | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const savedSearches = localStorage.getItem("recentSearches");
    if (savedSearches) {
      setRecentSearches(JSON.parse(savedSearches));
    }
  }, []);

  useEffect(() => {
    if (activeModal === "search") {
      setShowPlaceholder(false);
      if (inputRef.current) {
        inputRef.current.focus();
      }
    } else {
      setShowPlaceholder(true);
      setSearchQuery("");
    }
  }, [activeModal]);

  const saveRecentSearch = useCallback((suggestion: SearchSuggestion) => {
    setRecentSearches((prev) => {
      const newSearches = [
        suggestion,
        ...prev.filter((s) => s.id !== suggestion.id),
      ].slice(0, MAX_RECENT_SEARCHES);
      localStorage.setItem("recentSearches", JSON.stringify(newSearches));
      return newSearches;
    });
  }, []);

  const clearRecentSearches = useCallback(() => {
    setRecentSearches([]);
    localStorage.removeItem("recentSearches");
  }, []);

  const handleSearchInput = useCallback(async (value: string) => {
    setSearchQuery(value);
    setShowPlaceholder(false);

    if (searchTimeout.current) {
      clearTimeout(searchTimeout.current);
    }

    if (!value.trim()) {
      setSuggestions([]);
      return;
    }

    setIsLoading(true);
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
          const newSuggestions = data.features
            .map((feature: any) => ({
              id: feature.id,
              text: feature.text,
              place_name: feature.place_name,
              center: feature.center,
              type: feature.place_type?.[0],
              relevance: feature.relevance,
            }))
            .sort(
              (a: SearchSuggestion, b: SearchSuggestion) =>
                (b.relevance || 0) - (a.relevance || 0)
            );
          setSuggestions(newSuggestions);
        }
      } catch (error) {
        console.error("Error fetching suggestions:", error);
        setSuggestions([]);
      } finally {
        setIsLoading(false);
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
      saveRecentSearch(suggestion);
    },
    [onSuggestionClick, saveRecentSearch]
  );

  const handleKeyPress = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Enter") {
        handleSearch();
      } else if (e.key === "Escape") {
        setActiveModal(null);
      }
    },
    [handleSearch, setActiveModal]
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
            <div className="relative flex-1">
              <input
                ref={inputRef}
                type="text"
                value={searchQuery}
                onChange={(e) => handleSearchInput(e.target.value)}
                onKeyDown={handleKeyPress}
                placeholder={showPlaceholder ? "Search for a place..." : ""}
                className="w-full px-4 py-3 pl-10 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 p-1 hover:bg-gray-100 rounded-full"
                >
                  <X className="w-4 h-4 text-gray-400" />
                </button>
              )}
            </div>
            <button
              onClick={handleSearch}
              className="bg-blue-500 text-white px-6 py-3 rounded-xl hover:bg-blue-600 transition-colors flex items-center gap-2"
            >
              <SearchIcon size={18} />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto">
            {isLoading ? (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500" />
              </div>
            ) : suggestions.length > 0 ? (
              <div className="space-y-1">
                {suggestions.map((suggestion) => (
                  <div
                    key={suggestion.id}
                    onClick={() => handleSuggestionClick(suggestion)}
                    className="p-3 hover:bg-gray-50 cursor-pointer rounded-lg transition-colors"
                  >
                    <div className="flex items-start gap-3">
                      <MapPin className="w-5 h-5 text-gray-400 mt-0.5" />
                      <div>
                        <p className="font-medium text-gray-900">
                          {suggestion.text}
                        </p>
                        <p className="text-sm text-gray-500">
                          {suggestion.place_name}
                        </p>
                        {suggestion.type && (
                          <span className="inline-block mt-1 px-2 py-0.5 text-xs bg-gray-100 text-gray-600 rounded-full">
                            {suggestion.type}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : searchQuery ? (
              <div className="text-center py-8 text-gray-500">
                No results found
              </div>
            ) : recentSearches.length > 0 ? (
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm font-medium text-gray-500 flex items-center gap-2">
                    <History className="w-4 h-4" />
                    Recent Searches
                  </h3>
                  <button
                    onClick={clearRecentSearches}
                    className="text-sm text-blue-500 hover:text-blue-600"
                  >
                    Clear all
                  </button>
                </div>
                <div className="space-y-1">
                  {recentSearches.map((suggestion) => (
                    <div
                      key={suggestion.id}
                      onClick={() => handleSuggestionClick(suggestion)}
                      className="p-3 hover:bg-gray-50 cursor-pointer rounded-lg transition-colors"
                    >
                      <div className="flex items-start gap-3">
                        <Clock className="w-5 h-5 text-gray-400 mt-0.5" />
                        <div>
                          <p className="font-medium text-gray-900">
                            {suggestion.text}
                          </p>
                          <p className="text-sm text-gray-500">
                            {suggestion.place_name}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                Start typing to search
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
