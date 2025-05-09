import { ChevronUp, ChevronDown } from "lucide-react";
import { CATEGORIES } from "../../constants/categories";

interface CurrentLocation {
  coordinates: [number, number];
  address: string;
  city: string;
  state: string;
  country: string;
}

interface CategoriesPanelProps {
  isPanelVisible: boolean;
  isPanelExpanded: boolean;
  setIsPanelVisible: (visible: boolean) => void;
  setIsPanelExpanded: (expanded: boolean) => void;
  selectedCategory: string | null;
  setSelectedCategory: (category: string | null) => void;
  currentLocation: CurrentLocation | null;
  searchNearbyPlaces: (category: string, coordinates: [number, number]) => void;
}

export const CategoriesPanel = ({
  isPanelVisible,
  isPanelExpanded,
  setIsPanelVisible,
  setIsPanelExpanded,
  selectedCategory,
  setSelectedCategory,
  currentLocation,
  searchNearbyPlaces,
}: CategoriesPanelProps) => (
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
