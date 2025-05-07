import React, { useState } from 'react';

interface ProductAddModalProps {
  onClose: () => void;
  onAddProduct: (product: any) => void;
  editProduct?: any;
  editIndex?: number; // 🆕 index in array if editing
  onUpdateProduct?: (index: number, updated: any) => void; // 🆕 update callback
}

const ProductAddModal: React.FC<ProductAddModalProps> = ({ onClose, onAddProduct, editProduct, editIndex, onUpdateProduct }) => {
  const [productUrl, setProductUrl] = useState(editProduct?.url || '');
  const [productData, setProductData] = useState<any>(editProduct || null);

  const handleAddProduct = async () => {
    if (!productUrl) return;
  
    try {
      const res = await fetch("/api/fetch-product", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: productUrl }),
      });
  
      const data = await res.json();
      if (data.error) throw new Error(data.error);
  
      setProductData(data);
    } catch (err) {
      console.error("Failed to fetch preview:", err);
      alert("Could not fetch product info. Try another URL.");
    }
  };
  

  const handleConfirmAddProduct = () => {
    if (productData) {
      if (typeof editIndex === "number" && onUpdateProduct) {
        onUpdateProduct(editIndex, productData);
      } else {
        onAddProduct(productData);
      }
      onClose();
    }
  };
  

  return (
    <div className="fixed inset-0 backdrop-brightness-75 bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white rounded-lg p-6 w-[400px] max-w-[90%]">
        <div className="flex justify-between items-center">
          <h3 className="text-xl font-semibold">Add Product</h3>
          <button onClick={onClose} className="text-xl">&times;</button>
        </div>

        {/* Input for Product URL */}
        <div className="mt-4">
          <input
            type="text"
            placeholder="Paste a product link"
            value={productUrl}
            onChange={(e) => setProductUrl(e.target.value)}
            className="border w-full p-3 rounded-md mb-4"
          />
          <button
            onClick={handleAddProduct}
            className="w-full bg-purple-600 hover:bg-purple-800 text-white py-3 rounded-md mt-2"
          >
            Preview Product
          </button>
        </div>

        {/* Product Preview */}
        {productData && (
          <div className="mt-4">
            <div className="flex items-center space-x-4">
              <img
                src={productData.imageUrl}
                alt={productData.title}
                className="w-10 h-10 object-cover rounded-md"
              />
              <div>
                <h4 className="text-lg font-semibold">{productData.title}</h4>
                <p>{productData.price}</p>
              </div>
            </div>
            <button
              onClick={handleConfirmAddProduct}
              className="w-full bg-purple-600 hover:bg-purple-800 text-white py-3 rounded-md mt-4"
            >
              Add Product
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductAddModal;
