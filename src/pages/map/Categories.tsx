import { ChevronUp, ChevronDown } from "lucide-react";
import { CATEGORIES } from "../../constants/categories";
import { motion, AnimatePresence } from "framer-motion";

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
}: CategoriesPanelProps) => {
  const handlePanelToggle = () => {
    if (isPanelExpanded) {
      setIsPanelExpanded(false);
    } else {
      setIsPanelVisible(false);
    }
  };

  const handleCategoryClick = (categoryId: string) => {
    setSelectedCategory(categoryId);
    if (currentLocation) {
      searchNearbyPlaces(categoryId, currentLocation.coordinates);
    }
  };

  return (
    <AnimatePresence>
      {isPanelVisible && (
        <motion.div
          initial={{ y: "100%" }}
          animate={{ y: 0 }}
          exit={{ y: "100%" }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          className="absolute bottom-0 left-0 right-0 z-10"
        >
          <div className="bg-white rounded-t-3xl shadow-xl">
            <div className="px-6 py-4">
              <div
                className="w-12 h-1 bg-gray-200 rounded-full mx-auto mb-4 cursor-pointer hover:bg-gray-300 transition-colors"
                onClick={handlePanelToggle}
              />

              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-semibold text-gray-800">
                  What are you looking for?
                </h3>
                <button
                  onClick={handlePanelToggle}
                  className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                >
                  {isPanelExpanded ? (
                    <ChevronDown className="w-6 h-6 text-gray-600" />
                  ) : (
                    <ChevronUp className="w-6 h-6 text-gray-600" />
                  )}
                </button>
              </div>

              <div className="grid grid-cols-4 gap-4">
                {CATEGORIES.map((category) => (
                  <motion.button
                    key={category.id}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleCategoryClick(category.id)}
                    className={`flex flex-col items-center gap-3 p-4 rounded-2xl transition-all duration-200 ${
                      selectedCategory === category.id
                        ? "bg-blue-500 text-white shadow-lg shadow-blue-200"
                        : "bg-gray-50 hover:bg-gray-100"
                    }`}
                  >
                    <category.icon
                      className={`w-7 h-7 ${
                        selectedCategory === category.id
                          ? "text-white"
                          : "text-gray-600"
                      }`}
                    />
                    <span className="text-sm font-medium text-center">
                      {category.label}
                    </span>
                  </motion.button>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
