import { useState, useMemo } from "react";
import { Checkbox, Button, Rate } from "antd";

const FilterForm = ({ onFilter, onReset, categoryCounts, courses }) => {
  const [filters, setFilters] = useState({
    category: "",
    author: "",
    price: "",
    level: "",
    rating: 0,
  });

  const handleChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const handleApply = () => {
    onFilter(filters);
  };

  const handleReset = () => {
    setFilters({
      category: "",
      author: "",
      price: "",
      level: "",
      rating: 0,
    });
    onReset();
  };

  const authorCounts = useMemo(() => {
    const counts = {};
    courses.forEach((course) => {
      const author = course.provider_id?.name || "Unknown";
      counts[author] = (counts[author] || 0) + 1;
    });
    return counts;
  }, [courses]);

  const priceCounts = useMemo(() => {
    const counts = { free: 0, paid: 0 };
    courses.forEach((course) => {
      if (course.price === 0) counts.free += 1;
      else counts.paid += 1;
    });
    return counts;
  }, [courses]);

  const levelCounts = useMemo(() => {
    const counts = { all: courses.length };
    return counts;
  }, [courses]);

  const ratingCounts = useMemo(() => {
    const counts = { 5: 0, 4: 0, 3: 0, 2: 0 };
    courses.forEach((course) => {
      if (course.rating >= 5) counts[5] += 1;
      if (course.rating >= 4) counts[4] += 1;
      if (course.rating >= 3) counts[3] += 1;
      if (course.rating >= 2) counts[2] += 1;
    });
    return counts;
  }, [courses]);

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      {/* Categories */}
      <div className="mb-6">
        <h4 className="font-semibold text-gray-800 mb-2">CATEGORIES</h4>
        <div className="space-y-2">
          {categoryCounts.map((cat) => (
            <div key={cat.name} className="flex justify-between items-center">
              <Checkbox
                onChange={(e) =>
                  handleChange("category", e.target.checked ? cat.name : "")
                }
              >
                {cat.name}
              </Checkbox>
              <span className="text-gray-500">{cat.count}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Author */}
      <div className="mb-6">
        <h4 className="font-semibold text-gray-800 mb-2">AUTHOR</h4>
        {Object.entries(authorCounts).map(([author, count]) => (
          <div key={author} className="flex justify-between items-center">
            <Checkbox
              onChange={(e) =>
                handleChange("author", e.target.checked ? author : "")
              }
            >
              {author}
            </Checkbox>
            <span className="text-gray-500">{count}</span>
          </div>
        ))}
      </div>

      {/* Price */}
      <div className="mb-6">
        <h4 className="font-semibold text-gray-800 mb-2">PRICE</h4>
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <Checkbox
              onChange={(e) =>
                handleChange("price", e.target.checked ? "free" : "")
              }
            >
              Free
            </Checkbox>
            <span className="text-gray-500">{priceCounts.free}</span>
          </div>
          <div className="flex justify-between items-center">
            <Checkbox
              onChange={(e) =>
                handleChange("price", e.target.checked ? "paid" : "")
              }
            >
              Paid
            </Checkbox>
            <span className="text-gray-500">{priceCounts.paid}</span>
          </div>
        </div>
      </div>

      {/* Level */}
      <div className="mb-6">
        <h4 className="font-semibold text-gray-800 mb-2">LEVELS</h4>
        <div className="flex justify-between items-center">
          <Checkbox
            onChange={(e) =>
              handleChange("level", e.target.checked ? "all" : "")
            }
          >
            All Levels
          </Checkbox>
          <span className="text-gray-500">{levelCounts.all}</span>
        </div>
      </div>

      {/* Rating */}
      <div className="mb-6">
        <h4 className="font-semibold text-gray-800 mb-2">RATING</h4>
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <Checkbox
              onChange={(e) => handleChange("rating", e.target.checked ? 5 : 0)}
            >
              <Rate disabled defaultValue={5} className="text-sm" /> & up
            </Checkbox>
            <span className="text-gray-500">{ratingCounts[5]}</span>
          </div>
          <div className="flex justify-between items-center">
            <Checkbox
              onChange={(e) => handleChange("rating", e.target.checked ? 4 : 0)}
            >
              <Rate disabled defaultValue={4} className="text-sm" /> & up
            </Checkbox>
            <span className="text-gray-500">{ratingCounts[4]}</span>
          </div>
          <div className="flex justify-between items-center">
            <Checkbox
              onChange={(e) => handleChange("rating", e.target.checked ? 3 : 0)}
            >
              <Rate disabled defaultValue={3} className="text-sm" /> & up
            </Checkbox>
            <span className="text-gray-500">{ratingCounts[3]}</span>
          </div>
          <div className="flex justify-between items-center">
            <Checkbox
              onChange={(e) => handleChange("rating", e.target.checked ? 2 : 0)}
            >
              <Rate disabled defaultValue={2} className="text-sm" /> & up
            </Checkbox>
            <span className="text-gray-500">{ratingCounts[2]}</span>
          </div>
        </div>
      </div>

      {/* Buttons */}
      <div className="flex gap-4">
        <Button
          onClick={handleApply}
          className="flex-1 bg-orange-500 text-white border-none hover:bg-orange-600"
        >
          Apply
        </Button>
        <Button onClick={handleReset} className="flex-1">
          Reset
        </Button>
      </div>
    </div>
  );
};

export default FilterForm;
