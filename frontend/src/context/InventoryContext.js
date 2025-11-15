import React, { createContext, useContext, useState, useEffect, useRef, useCallback } from 'react';
import { itemAPI } from '../services/api';

const InventoryContext = createContext();

export const useInventory = () => {
  const context = useContext(InventoryContext);
  if (!context) {
    throw new Error('useInventory must be used within InventoryProvider');
  }
  return context;
};

export const InventoryProvider = ({ children }) => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    itemsPerPage: 10,
  });
  const [filters, setFilters] = useState({
    search: '',
    category: '',
    minPrice: '',
    maxPrice: '',
    sortBy: 'createdAt',
    sortOrder: 'desc',
  });
  
  const filtersRef = useRef(filters);
  const debounceTimer = useRef(null);

  // Update ref when filters change
  useEffect(() => {
    filtersRef.current = filters;
  }, [filters]);

  // Fetch items with current filters
  const fetchItems = useCallback(async (page = 1) => {
    try {
      setLoading(true);
      const params = {
        page,
        limit: pagination.itemsPerPage,
        ...filtersRef.current,
      };
      
      const response = await itemAPI.getAll(params);
      setItems(response.data.items);
      setPagination(response.data.pagination);
    } catch (error) {
      console.error('Error fetching items:', error);
    } finally {
      setLoading(false);
    }
  }, [pagination.itemsPerPage]);

  // Update filters and fetch
  const updateFilters = useCallback((newFilters) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
  }, []);

  // Update pagination
  const updatePagination = useCallback((newPagination) => {
    setPagination((prev) => ({ ...prev, ...newPagination }));
  }, []);

  // Reset filters
  const resetFilters = useCallback(() => {
    setFilters({
      search: '',
      category: '',
      minPrice: '',
      maxPrice: '',
      sortBy: 'createdAt',
      sortOrder: 'desc',
    });
  }, []);

  // Refresh items when filters or itemsPerPage change
  useEffect(() => {
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }
    
    debounceTimer.current = setTimeout(() => {
      fetchItems(1);
    }, 300);
    
    return () => {
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current);
      }
    };
  }, [filters, pagination.itemsPerPage, fetchItems]);

  const value = {
    items,
    loading,
    pagination,
    filters,
    fetchItems,
    updateFilters,
    updatePagination,
    resetFilters,
    setItems,
  };

  return (
    <InventoryContext.Provider value={value}>
      {children}
    </InventoryContext.Provider>
  );
};
