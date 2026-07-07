import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { api, setToken } from '../lib/api';

const AuthContext = createContext(null);
const CatalogContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const refreshAuth = useCallback(async () => {
    if (!localStorage.getItem('helmet_auth_token')) {
      setUser(null);
      setLoading(false);
      return;
    }

    try {
      const data = await api.me();
      setUser(data.user);
    } catch {
      setToken(null);
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshAuth();
  }, [refreshAuth]);

  const login = async (username, password) => {
    const data = await api.login(username, password);
    setToken(data.token);
    setUser(data.user);
    return true;
  };

  const logout = async () => {
    try {
      await api.logout();
    } catch {
      // ignore
    }
    setToken(null);
    setUser(null);
  };

  const value = useMemo(() => ({
    user,
    loading,
    isAdmin: !!user,
    login,
    logout,
    refreshAuth,
  }), [user, loading, refreshAuth]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function CatalogProvider({ children }) {
  const [catalog, setCatalog] = useState({
    addons: [],
    deliveryOptions: [],
    orderSteps: [],
  });
  const [services, setServices] = useState([]);
  const [outlets, setOutlets] = useState([]);
  const [loading, setLoading] = useState(true);

  const refreshCatalog = useCallback(async () => {
    setLoading(true);
    try {
      const [catalogData, servicesData, outletsData] = await Promise.all([
        api.getCatalog(),
        api.getServices(),
        api.getOutlets(),
      ]);
      setCatalog({
        addons: catalogData.addons,
        deliveryOptions: catalogData.deliveryOptions,
        orderSteps: catalogData.orderSteps,
      });
      setServices(servicesData);
      setOutlets(outletsData);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshCatalog();
  }, [refreshCatalog]);

  const value = useMemo(() => ({
    ...catalog,
    services,
    outlets,
    loading,
    refreshCatalog,
    setServicesLocal: setServices,
  }), [catalog, services, outlets, loading, refreshCatalog]);

  return <CatalogContext.Provider value={value}>{children}</CatalogContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}

export function useCatalog() {
  const ctx = useContext(CatalogContext);
  if (!ctx) throw new Error('useCatalog must be used within CatalogProvider');
  return ctx;
}
