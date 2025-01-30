import React, { useState, useEffect } from "react";
import sifrantData from "/src/assets/data/Šifrant Enot Yamaha.json";
import categoriesData from "/src/assets/data/Categories.json";
import accessoriesData from "/src/assets/data/Accessories.json"; // <-- Import accessories
import "./SifrantEnotYamaha.css"; // Import CSS file

/**
 * Helper to read an attribute value from a variant's attributes array.
 * If not found, returns undefined.
 */
function getAttributeValue(variant, attrName) {
  if (!variant || !variant.attributes) return undefined;
  const attr = variant.attributes.find((a) => a.name === attrName);
  return attr ? attr.value : undefined;
}

const SifrantEnotYamaha = () => {
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedProductGroup, setSelectedProductGroup] = useState("");
  const [selectedYear, setSelectedYear] = useState("");

  const [categoryHierarchy, setCategoryHierarchy] = useState({});
  const [productHierarchy, setProductHierarchy] = useState({});

  // We'll store accessories in a lookup map (key => accessory object).
  const [accessoryMap, setAccessoryMap] = useState({});

  /**
   * Build a map (object) from accessory key => entire accessory object
   * for easy lookups in the product listing.
   */
  const buildAccessoryMap = (accessoriesArray) => {
    const map = {};
    accessoriesArray.forEach((acc) => {
      if (acc && acc.key) {
        map[acc.key] = acc;
      }
    });
    return map;
  };

  /**
   * Build product hierarchy by category => productGroup => year => [ { product, variant }, ... ]
   * Filter out unpublished / archived items as needed.
   */
  const buildProductHierarchy = (products) => {
    const hierarchy = {};

    products.forEach((product) => {
      if (!product.published) return; // Check if the product is published

      const master = product.masterVariant;
      if (!master) return;

      // Check master variant for product-level status
      const masterIsArchived = getAttributeValue(master, "archiveProduct") === true;
      const masterIsPublished = getAttributeValue(master, "publishVariant") === true;

      // If master variant is archived or not published => skip entire product
      if (masterIsArchived || !masterIsPublished) return;

      // Combine masterVariant + child variants
      let allVariants = [master, ...(product.variants || [])];

      // Filter out any variant that is archived or not published
      allVariants = allVariants.filter((variant) => {
        const varArchived = getAttributeValue(variant, "archiveProduct") === true;
        const varPublished = getAttributeValue(variant, "publishVariant") === true;
        return !varArchived && varPublished;
      });

      // If no variants remain after filtering, skip
      if (allVariants.length === 0) return;

      // If the product has no categories, skip
      if (!product.categories || product.categories.length === 0) return;

      // Insert valid variants into the hierarchy
      product.categories.forEach((category) => {
        const categoryKey = category.key;
        if (!hierarchy[categoryKey]) {
          hierarchy[categoryKey] = {};
        }

        allVariants.forEach((variant) => {
          // For grouping by productPCMCode / productYear
          const productGroup = getAttributeValue(variant, "productPCMCode") || "Unknown Group";
          const productYear = getAttributeValue(variant, "productYear") || "Unknown Year";

          if (!hierarchy[categoryKey][productGroup]) {
            hierarchy[categoryKey][productGroup] = {};
          }
          if (!hierarchy[categoryKey][productGroup][productYear]) {
            hierarchy[categoryKey][productGroup][productYear] = [];
          }

          hierarchy[categoryKey][productGroup][productYear].push({
            product,
            variant,
          });
        });
      });
    });

    // Sort year keys descending if numeric, with "Unknown" at the end
    Object.keys(hierarchy).forEach((categoryKey) => {
      Object.keys(hierarchy[categoryKey]).forEach((group) => {
        const yearsMap = hierarchy[categoryKey][group];

        const sortedYears = Object.keys(yearsMap).sort((a, b) => {
          const numA = parseInt(a, 10);
          const numB = parseInt(b, 10);
          if (!isNaN(numA) && !isNaN(numB)) {
            return numB - numA; // descending numeric
          }
          if (isNaN(numA) && !isNaN(numB)) return 1;
          if (!isNaN(numA) && isNaN(numB)) return -1;
          return 0;
        });

        hierarchy[categoryKey][group] = Object.fromEntries(
          sortedYears.map((year) => [year, yearsMap[year]])
        );
      });
    });

    return hierarchy;
  };

  /**
   * 2) Build the hierarchical category structure from categoriesData.
   */
  const buildCategoryHierarchy = () => {
    const hierarchy = {};
    const categoryMap = {};

    categoriesData.forEach((category) => {
      categoryMap[category.key] = {
        name: category.name.en,
        parent: category.parent?.key || null,
        subcategories: {},
      };
    });

    // Recursively assign subcategories
    const assignSubcategories = (parentKey, parentObj) => {
      Object.entries(categoryMap).forEach(([key, cat]) => {
        if (cat.parent === parentKey) {
          parentObj.subcategories[key] = cat;
          assignSubcategories(key, cat);
        }
      });
    };

    // Build top-level categories
    Object.entries(categoryMap).forEach(([key, category]) => {
      if (!category.parent) {
        hierarchy[key] = category;
        assignSubcategories(key, category);
      }
    });

    return hierarchy;
  };

  /**
   * 3) Prune categoryHierarchy so that only categories with valid products remain.
   */
  const pruneCategoryHierarchy = (hierarchy, productHierarchy) => {
    const hasProductsRecursively = (nodeKey, nodeObj) => {
      // Prune subcategories first
      Object.entries(nodeObj.subcategories).forEach(([subKey, subCategory]) => {
        const keep = hasProductsRecursively(subKey, subCategory);
        if (!keep) {
          delete nodeObj.subcategories[subKey];
        }
      });

      // This category has direct products if it exists in productHierarchy
      const directHasProducts = !!productHierarchy[nodeKey];
      const hasSubcategories = Object.keys(nodeObj.subcategories).length > 0;

      return directHasProducts || hasSubcategories;
    };

    Object.entries(hierarchy).forEach(([key, category]) => {
      const keep = hasProductsRecursively(key, category);
      if (!keep) {
        delete hierarchy[key];
      }
    });

    return hierarchy;
  };

  // Load and prepare data on mount
  useEffect(() => {
    // 1) Build productHierarchy
    const builtProductHierarchy = buildProductHierarchy(sifrantData);

    // 2) Build the full category hierarchy
    const builtCategoryHierarchy = buildCategoryHierarchy();

    // 3) Prune empty categories
    const prunedHierarchy = pruneCategoryHierarchy(
      builtCategoryHierarchy,
      builtProductHierarchy
    );

    // Build accessory map
    const accMap = buildAccessoryMap(accessoriesData);

    // Store in state
    setProductHierarchy(builtProductHierarchy);
    setCategoryHierarchy(prunedHierarchy);
    setAccessoryMap(accMap);
  }, []);

  // Handle category dropdown changes
  const handleCategoryChange = (level, value) => {
    const updated = [...selectedCategories];
    updated[level] = value;
    // Clear deeper levels
    updated.splice(level + 1);
    setSelectedCategories(updated);
    setSelectedProductGroup("");
    setSelectedYear("");
  };

  // Get subcategories at a given dropdown level
  const getSubcategoriesAtLevel = (level) => {
    let current = categoryHierarchy;
    for (let i = 0; i < level; i++) {
      const catKey = selectedCategories[i];
      if (!catKey || !current[catKey]) return {};
      current = current[catKey].subcategories;
    }
    return current;
  };

  const lastSelectedCategory =
    selectedCategories.length > 0
      ? selectedCategories[selectedCategories.length - 1]
      : null;

  const productGroups =
    lastSelectedCategory && productHierarchy[lastSelectedCategory]
      ? Object.keys(productHierarchy[lastSelectedCategory])
      : [];

  const years =
    lastSelectedCategory &&
    selectedProductGroup &&
    productHierarchy[lastSelectedCategory] &&
    productHierarchy[lastSelectedCategory][selectedProductGroup]
      ? Object.keys(
          productHierarchy[lastSelectedCategory][selectedProductGroup]
        )
      : [];

  const productList =
    lastSelectedCategory &&
    selectedProductGroup &&
    selectedYear &&
    productHierarchy[lastSelectedCategory] &&
    productHierarchy[lastSelectedCategory][selectedProductGroup] &&
    productHierarchy[lastSelectedCategory][selectedProductGroup][selectedYear]
      ? productHierarchy[lastSelectedCategory][selectedProductGroup][selectedYear]
      : [];

    const handleShowAccessories = (variant) => {
      // "accessories" attribute is typically an array of keys
      const variantAccessories = getAttributeValue(variant, "accessories") || [];
    
      // Map each accessory key to the accessory's masterVariant.sku (removing dashes)
      const accessorySKUs = variantAccessories
        .map((accKey) => {
          const accessoryObj = accessoryMap[accKey];
          const rawSku = accessoryObj?.masterVariant?.sku || null;
          // Remove all dashes from the SKU string
          return rawSku ? rawSku.replace(/-/g, "") : null;
        })
        .filter(Boolean); // remove nulls if an accessory is missing
    
      if (accessorySKUs.length === 0) {
        alert("No accessories found for this variant.");
        return;
      }
    
      alert(`Accessories SKUs: ${accessorySKUs.join(", ")}`);
    };
      

  return (
    <div className="menu-container">
      <h2 className="menu-title">Yamaha Products</h2>

      {/* Category dropdowns */}
      {Array.from({ length: selectedCategories.length + 1 }).map((_, level) => {
        const subcategories = getSubcategoriesAtLevel(level);
        if (!subcategories || Object.keys(subcategories).length === 0) {
          return null;
        }

        return (
          <select
            key={level}
            className="dropdown"
            value={selectedCategories[level] || ""}
            onChange={(e) => handleCategoryChange(level, e.target.value)}
          >
            <option value="">Select Category</option>
            {Object.entries(subcategories).map(([key, cat]) => (
              <option key={key} value={key}>
                {cat.name}
              </option>
            ))}
          </select>
        );
      })}

      {/* Product Group */}
      {productGroups.length > 0 && (
        <select
          className="dropdown"
          value={selectedProductGroup}
          onChange={(e) => setSelectedProductGroup(e.target.value)}
        >
          <option value="">Select Product Group</option>
          {productGroups.map((group) => (
            <option key={group} value={group}>
              {group}
            </option>
          ))}
        </select>
      )}

      {/* Year */}
      {years.length > 0 && (
        <select
          className="dropdown"
          value={selectedYear}
          onChange={(e) => setSelectedYear(e.target.value)}
        >
          <option value="">Select Year</option>
          {years.map((year) => (
            <option key={year} value={year}>
              {year}
            </option>
          ))}
        </select>
      )}

      {/* Product/Variant List */}
      {productList.length > 0 && (
        <div className="product-list">
          <h3>Variants</h3>
          <ul>
            {productList.map(({ product, variant }, idx) => {
              const color = getAttributeValue(variant, "colourName") || "Unknown Color";

              return (
                <li key={`${product.key}-${idx}`}>
                  <div>
                    <strong>{product.name?.en || product.key}</strong> - {color}
                  </div>
                  <div className="variant-sku">SKU: {variant.sku || "N/A"}</div>
                  <div                  >
                    {/* Button to show accessory SKUs */}
                    <button class="btn btn-primary" onClick={() => handleShowAccessories(variant)}>
                      Show Accessories
                    </button>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
};

export default SifrantEnotYamaha;
