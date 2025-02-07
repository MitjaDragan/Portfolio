import React, { useState } from "react";
import sifrantData from "/src/assets/data/Šifrant Enot Yamaha.json";
import accessoriesData from "/src/assets/data/Accessories.json";
import "./AccessoryFinder.css";

const AccessoryFinder = () => {
  const [inputSKU, setInputSKU] = useState("");
  const [matchedProducts, setMatchedProducts] = useState([]);

  const buildAccessoryMap = (accessoriesArray) => {
    const map = {};
    accessoriesArray.forEach((acc) => {
      if (acc && acc.key) {
        map[acc.key] = acc;
      }
    });
    return map;
  };

  const accessoryMap = buildAccessoryMap(accessoriesData);

  const handleSearch = () => {
    const matched = [];
    
    sifrantData.forEach((product) => {
      const variants = [product.masterVariant, ...(product.variants || [])];

      variants.forEach((variant) => {
        const variantAccessories = variant.attributes?.find(
          (attr) => attr.name === "accessories"
        )?.value || [];

        const accessorySKUs = variantAccessories.map((accKey) => {
          const accessoryObj = accessoryMap[accKey];
          const rawSku = accessoryObj?.masterVariant?.sku || "";
          return rawSku.replace(/-/g, "");
        });

        if (accessorySKUs.includes(inputSKU)) {
          matched.push({
            productName: product.name?.en || "Unknown Product",
            variantColor: variant.attributes?.find(attr => attr.name === "colourName")?.value || "Unknown Color",
            sku: variant.sku || "N/A",
          });
        }
      });
    });

    setMatchedProducts(matched);
  };

  return (
    <div className="accessory-finder-container">
      <h2>Find Products by Accessory SKU</h2>
      <div className="input-group">
        <input
          type="text"
          placeholder="Enter Accessory SKU (without '-')"
          value={inputSKU}
          onChange={(e) => setInputSKU(e.target.value)}
          className="input-field"
        />
        <button className="search-button" onClick={handleSearch}>
          Search
        </button>
      </div>
      <div className="results">
        {matchedProducts.length > 0 ? (
          <ul>
            {matchedProducts.map((product, idx) => (
              <li key={idx} className="result-item">
                <strong>{product.productName}</strong> - {product.variantColor}
                <div>SKU: {product.sku}</div>
              </li>
            ))}
          </ul>
        ) : (
          <p>No products found for the entered accessory SKU.</p>
        )}
      </div>
    </div>
  );
};

export default AccessoryFinder;
