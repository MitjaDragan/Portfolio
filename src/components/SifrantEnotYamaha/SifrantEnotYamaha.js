import React, { useState, useEffect } from "react";
import sifrantData from "/src/assets/data/Šifrant Enot Yamaha.json";
import categoriesData from "/src/assets/data/Categories_Export_01-30-25_10-59.json";
import "./SifrantEnotYamaha.css"; // Import CSS file

const SifrantEnotYamaha = () => {
  const [selectedMainCategory, setSelectedMainCategory] = useState("");
  const [selectedSubCategory, setSelectedSubCategory] = useState("");
  const [selectedSubSubCategory, setSelectedSubSubCategory] = useState("");
  const [selectedProductGroup, setSelectedProductGroup] = useState("");
  const [selectedYear, setSelectedYear] = useState("");
  const [categoryHierarchy, setCategoryHierarchy] = useState({});

  useEffect(() => {
    const buildCategoryHierarchy = () => {
      const hierarchy = {};
      const categoryMap = {};

      // First pass: Create a map of categories
      categoriesData.forEach((category) => {
        categoryMap[category.key] = {
          name: category.name.en,
          parent: category.parent?.key || null,
          subcategories: {},
        };
      });

      // Second pass: Assign subcategories to their parents
      Object.entries(categoryMap).forEach(([key, category]) => {
        if (category.parent && categoryMap[category.parent]) {
          categoryMap[category.parent].subcategories[key] = category;
        } else {
          hierarchy[key] = category;
        }
      });

      console.log("Final Category Hierarchy:", hierarchy);
      setCategoryHierarchy(hierarchy);
    };

    buildCategoryHierarchy();
  }, []);

  return (
    <div className="menu-container">
      <h2 className="menu-title">Yamaha Products</h2>
      
      {/* Main Category Dropdown */}
      <select
        className="dropdown"
        value={selectedMainCategory}
        onChange={(e) => {
          setSelectedMainCategory(e.target.value);
          setSelectedSubCategory("");
          setSelectedSubSubCategory("");
          setSelectedProductGroup("");
          setSelectedYear("");
        }}
      >
        <option value="">Select Category</option>
        {Object.entries(categoryHierarchy).map(([key, category]) => (
          <option key={key} value={key}>{category.name}</option>
        ))}
      </select>

      {/* Subcategory Dropdown */}
      {selectedMainCategory && Object.keys(categoryHierarchy[selectedMainCategory]?.subcategories || {}).length > 0 && (
        <select
          className="dropdown"
          value={selectedSubCategory}
          onChange={(e) => {
            setSelectedSubCategory(e.target.value);
            setSelectedSubSubCategory("");
            setSelectedProductGroup("");
            setSelectedYear("");
          }}
        >
          <option value="">Select Subcategory</option>
          {Object.entries(categoryHierarchy[selectedMainCategory].subcategories).map(([key, subcategory]) => (
            <option key={key} value={key}>{subcategory.name}</option>
          ))}
        </select>
      )}

      {/* Sub-subcategory Dropdown */}
      {selectedSubCategory && Object.keys(categoryHierarchy[selectedMainCategory]?.subcategories[selectedSubCategory]?.subcategories || {}).length > 0 && (
        <select
          className="dropdown"
          value={selectedSubSubCategory}
          onChange={(e) => {
            setSelectedSubSubCategory(e.target.value);
            setSelectedProductGroup("");
            setSelectedYear("");
          }}
        >
          <option value="">Select Sub-subcategory</option>
          {Object.entries(categoryHierarchy[selectedMainCategory].subcategories[selectedSubCategory].subcategories).map(([key, subsubcategory]) => (
            <option key={key} value={key}>{subsubcategory.name}</option>
          ))}
        </select>
      )}
    </div>
  );
};

export default SifrantEnotYamaha;
