import React, { useState, useEffect } from "react";
import sifrantData from "/src/assets/data/Šifrant Enot Yamaha.json";
import categoriesData from "/src/assets/data/Categories.json";
import accessoriesData from "/src/assets/data/Accessories.json";
import "./SifrantEnotYamaha.css";

import AccessoryFinder from "./AccessoryFinder";

// Pridobitev pripadajočih artiklov
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
  const [accessoryMap, setAccessoryMap] = useState({});

  // Priprava artiklov
  const buildAccessoryMap = (accessoriesArray) => {
    const map = {};
    accessoriesArray.forEach((acc) => {
      if (acc && acc.key) {
        map[acc.key] = acc;
      }
    });
    return map;
  };

  // Urejanje produktov glede na kategorije, modele ipd.
  const buildProductHierarchy = (products) => {
    const hierarchy = {};
    const groupedProductsMap = new Map();

    // Povezovanje arhiviranih produktov z pripadajočimi objavljenimi produkti
    products.forEach((product) => {
      const groupingProducts = getAttributeValue(product.masterVariant, "groupingProducts") || [];
      groupingProducts.forEach((id) => {
        groupedProductsMap.set(id, product);
      });
    });

    // Urejanje statusov produktov
    products.forEach((product) => {
      const isPublished = product.published;
      const isArchived = getAttributeValue(product.masterVariant, "archiveProduct") === false;
      const isGrouped = groupedProductsMap.has(product.key);
      const isGroupedAndPublished = isGrouped && groupedProductsMap.get(product.key)?.published;

      if ((!isPublished || !isArchived) && !isGroupedAndPublished) return;
      const master = product.masterVariant;
      if (!master) return;
      const masterIsPublished = getAttributeValue(master, "publishVariant") === true;
      if (!masterIsPublished) return;

      let allVariants = [master, ...(product.variants || [])].filter(
        (variant) => getAttributeValue(variant, "publishVariant") === true
      );
      if (!product.categories || product.categories.length === 0) return;

      product.categories.forEach((category) => {
        const categoryKey = category.key;
        if (!hierarchy[categoryKey]) {
          hierarchy[categoryKey] = {};
        }

        allVariants.forEach((variant) => {
          const productName = product.name?.en || "Unknown Name";
          const productYear = getAttributeValue(variant, "productYear") || "Unknown Year";

          if (!hierarchy[categoryKey][productName]) {
            hierarchy[categoryKey][productName] = {};
          }
          if (!hierarchy[categoryKey][productName][productYear]) {
            hierarchy[categoryKey][productName][productYear] = [];
          }

          hierarchy[categoryKey][productName][productYear].push({
            product,
            variant,
          });
        });
      });
    });

    // Urejanje produktov po abecedi
    Object.keys(hierarchy).forEach((categoryKey) => {
      hierarchy[categoryKey] = Object.fromEntries(
        Object.entries(hierarchy[categoryKey]).sort((a, b) => a[0].localeCompare(b[0]))
      );
    });
    
    return hierarchy;
  };

  //Skrivanje kategorij, ki ne vsebujejo objavljenih produktov
  const pruneCategoryHierarchy = (hierarchy, productHierarchy) => {
    const hasProductsRecursively = (nodeKey, nodeObj) => {
      Object.entries(nodeObj.subcategories).forEach(([subKey, subCategory]) => {
        const keep = hasProductsRecursively(subKey, subCategory);
        if (!keep) {
          delete nodeObj.subcategories[subKey];
        }
      });

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

  // Kreiranje seznama kategorij
  const buildCategoryHierarchy = () => {
    const hierarchy = {};
    const categoryMap = {};

    categoriesData.forEach((category) => {
      const isPublished = category.custom?.fields?.published;
      if (!isPublished) return;

      categoryMap[category.key] = {
        name: category.name["sl-SI"] || category.name["en"],
        parent: category.parent?.key || null,
        subcategories: {},
      };
    });

    const assignSubcategories = (parentKey, parentObj) => {
      Object.entries(categoryMap).forEach(([key, cat]) => {
        if (cat.parent === parentKey) {
          parentObj.subcategories[key] = cat;
          assignSubcategories(key, cat);
        }
      });
    };

    Object.entries(categoryMap).forEach(([key, category]) => {
      if (!category.parent) {
        hierarchy[key] = category;
        assignSubcategories(key, category);
      }
    });
    return hierarchy;
  };

  useEffect(() => {
    const builtProductHierarchy = buildProductHierarchy(sifrantData);
    let builtCategoryHierarchy = buildCategoryHierarchy();
    builtCategoryHierarchy = pruneCategoryHierarchy(builtCategoryHierarchy, builtProductHierarchy);
    const accMap = buildAccessoryMap(accessoriesData);

    setProductHierarchy(builtProductHierarchy);
    setCategoryHierarchy(builtCategoryHierarchy);
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

  // productGroups are now product names
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

  /**
   * Example: minimal "Show Accessories" button for each variant
   */
  const handleShowAccessories = (variant) => {
    // "accessories" attribute is typically an array of accessory keys
    const variantAccessories = getAttributeValue(variant, "accessories") || [];

    // Map each accessory key to the accessory's masterVariant.sku (removing dashes)
    const accessorySKUs = variantAccessories
      .map((accKey) => {
        const accessoryObj = accessoryMap[accKey];
        const rawSku = accessoryObj?.masterVariant?.sku || null;
        return rawSku ? rawSku.replace(/-/g, "") : null;
      })
      .filter(Boolean); 

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

      {/* Product Group (now really the product's name) */}
      {productGroups.length > 0 && (
        <select
          className="dropdown"
          value={selectedProductGroup}
          onChange={(e) => setSelectedProductGroup(e.target.value)}
        >
          <option value="">Select Product Name</option>
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
              const pcmCode = getAttributeValue(variant, "productPCMCode") || "N/A";
              const pscRaw = getAttributeValue(variant, "productMPLCodes") || "N/A";
              const productMPLCodes = Array.isArray(pscRaw) ? pscRaw.join(", ") : pscRaw;
              const productSlug = product.slug?.en || "N/A";

              return (
                <li key={`${product.key}-${idx}`}>
                  <div>
                    {/* Display product name and variant color */}
                    <strong>{product.name?.en || product.key}</strong> – {color}
                  </div>

                  {/* SKU */}
                  <div className="variant-sku">
                    SKU: {variant.sku || "N/A"}
                  </div>

                  {/* PCM code */}
                  <div className="variant-PCM">
                    PCM: {pcmCode}
                  </div>

                  {/* Product service codes */}
                  <div className="variant-MPL">
                    MPL: {productMPLCodes}
                  </div>

                  {/* Slug */}
                  <div className="variant-slug">
                    Slug: {productSlug}
                  </div>

                  {/* Button to show accessory SKUs */}
                  <div style={{ marginTop: "0.5rem" }}>
                    <button
                      className="btn btn-primary"
                      onClick={() => handleShowAccessories(variant)}
                    >
                      Show Accessories
                    </button>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      )}
      <AccessoryFinder />
    </div>
  );
};

export default SifrantEnotYamaha;

// Starting transfer to an Odoo 18 custom module.
//
// To-Do list
//
// Create basic draft of a module *
// Add categories and product logic *
// Create an xml template *
// Add a basic css design *
// Fix filtering *
// 
// Move JSON data to custom fields *
// Fix variants not showing *
// 
// Honestly just making this commit to say I made a python program for updating a bunch of pdf's at once. Saving about a weeks worth of time.