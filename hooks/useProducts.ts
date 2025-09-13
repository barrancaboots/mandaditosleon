  // hooks/useProducts.ts

  import { useState, useEffect } from 'react';
  import { supabase } from '../lib/supabase';
  import { devLog } from '../lib/devLogger';
  // Importamos el tipo principal de la BD para derivar nuestros tipos locales.
  import { Database } from '../types/database';

  // Derivamos los tipos directamente del esquema para máxima consistencia.
  type Category = Database['public']['Tables']['categories']['Row'];
  type Product = Database['public']['Tables']['products']['Row'];

  export function useProducts() {
    const [categories, setCategories] = useState<Category[]>([]);
    const [products, setProducts] = useState<Product[]>([]);
    // El ID de la categoría es un número, como en la base de datos.
    const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
    const [loading, setLoading] = useState(false);
    const [refreshing, setRefreshing] = useState(false);

    useEffect(() => {
      fetchCategories();
    }, []);

    useEffect(() => {
      if (selectedCategory !== null) {
        fetchProducts(selectedCategory);
      }
    }, [selectedCategory]);

    const fetchCategories = async () => {
      devLog('Iniciando fetch de categorías...');
      try {
        const { data, error } = await supabase
          .from('categories')
          .select('*')
          .order('name');

        if (error) throw error;
        
        const categoriesData = data || [];
        setCategories(categoriesData);
        devLog('✅ Éxito en fetch de categorías:', categoriesData);

        if (categoriesData.length > 0 && selectedCategory === null) {
          // Esta lógica ahora es segura porque TypeScript sabe que `id` existe y es de tipo `number`.
          setSelectedCategory(categoriesData[0].id);
        }
      } catch (error) {
        devLog('❌ Error en fetch de categorías:', error);
        console.error('Error fetching categories:', error);
      }
    };

    const fetchProducts = async (categoryId: number) => {
      devLog(`Iniciando fetch de productos para categoría ID: ${categoryId}`);
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('products')
          .select('*')
          .eq('category_id', categoryId)
          .order('name');

        if (error) throw error;
        setProducts(data || []);
        devLog(`✅ Éxito en fetch de productos para categoría ${categoryId}:`, data);
      } catch (error) {
        devLog(`❌ Error en fetch de productos para categoría ${categoryId}:`, error);
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false);
      }
    };

    const onRefresh = async () => {
      setRefreshing(true);
      await fetchCategories();
      if (selectedCategory !== null) {
        await fetchProducts(selectedCategory);
      }
      setRefreshing(false);
    };

    return { 
      categories, 
      products, 
      selectedCategory, 
      setSelectedCategory, 
      loading, 
      refreshing, 
      onRefresh 
    };
  }

