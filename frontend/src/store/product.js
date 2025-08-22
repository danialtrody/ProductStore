import {create} from "zustand";
// Zustand store for managing product state
// This store will hold the products and provide a method to update them
export const useProductStore = create((set) => ({
  products: [], // Initial state for products
  setProducts: (products) => set({ products }), // Method to update the products state
  createProduct: async (newProduct) => {
    // Function to create a new product

    if(!newProduct.name || !newProduct.image || !newProduct.price) {
      return {success:false, message: "Please fill all fields"};
    }
    const res = await fetch("/api/products",
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(newProduct)
        });
    const data = await res.json();
    set((state) => ({
        products: [...state.products, data.data]
  }));
        return {success: true, message: "Product created successfully"};
  },
  fetchProducts: async () => {
    // Function to fetch products from the backend
    try {
      const res = await fetch("/api/products");
      const data = await res.json();
      set({ products: data.data }); // Update the products state with fetched data
    } catch (error) {
      console.error("Failed to fetch products:", error);
    }
  },
  deleteProduct: async (pid) => {
    const res = await fetch(`/api/products/${pid}`, {
      method: "DELETE",
    });
    const data = await res.json();
    if (!data.success) {
      return { success: false, message: data.message };
    }

    set((state) => ({
      products: state.products.filter((product) => product._id !== pid),
    }));
    return { success: true, message: "Product deleted successfully" };
  },
  updateProduct: async (pid,updateProduct) => {
    const res = await fetch(`/api/products/${pid}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updateProduct),
    });
    const data = await res.json();
    if (!data.success) {
      return { success: false, message: data.message };
    }

    //update the ui immediately without refetching
    set((state) => ({
      products: state.products.map((product) =>
        product._id === pid ? data.data : product
      ),
    }));
    return { success: true, message: data.message }
  }

}));
