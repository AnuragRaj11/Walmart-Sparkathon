import pandas as pd

# Load Walmart CSV
df = pd.read_csv("backend/ai_model/walmart-products.csv")

# Rename columns to match expected frontend fields
df = df.rename(columns={
    "product_name": "name",
    "final_price": "price",
    "main_image": "image",
    "category_name": "category"
})

# Drop rows with missing essential data
df = df.dropna(subset=["name", "price", "image"])

# Optional: round price to 2 decimals
df["price"] = df["price"].round(2)

# Generate unique IDs
df["id"] = [str(i) for i in range(1, len(df)+1)]

# Select final fields
df = df[["id", "name", "price", "image", "category"]]

# Save as JSON in frontend folder
df.to_json("frontend/src/data/walmart-products.json", orient="records", indent=2)

print("✅ walmart-products.json created successfully.")
