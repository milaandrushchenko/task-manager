import { useState, useEffect } from "react";
import { categoriesEndpoint } from "@/api/endpoints/categories.endpoint";
import type { Category } from "@/types/api.types";

export const useCategories = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchCategories = async () => {
    try {
      setLoading(true);

      const response = await categoriesEndpoint.getAll();

      setCategories(response.list ?? []);
    } catch (err) {
      console.error("Failed to load categories:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void fetchCategories();
  }, []);

  return { categories, loading };
};
