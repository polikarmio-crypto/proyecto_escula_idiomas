'use client';

import { useState, useEffect, useRef, useCallback } from 'react';

export interface UseDynamicPaginationOptions {
  rowHeight?: number;      // Altura aproximada de fila en px (default: 56 para 2 líneas, 44 para 1 línea)
  minItems?: number;       // Mínimo de filas por página (default: 5)
  maxItems?: number;       // Máximo de filas por página (default: 25)
  reservedHeight?: number; // Altura ocupada por thead + paginación + márgenes (default: 80)
}

/**
 * useDynamicPagination
 * Hook que calcula dinámicamente el número de filas (pageSize) que caben exactamente
 * en el alto disponible del contenedor midiendo la altura real disponible descontando
 * thead y la barra de paginación, con un margen de seguridad de 8px para garantizar
 * que ninguna fila vuelva a quedar cortada a la mitad.
 */
export function useDynamicPagination(options: UseDynamicPaginationOptions = {}) {
  const {
    rowHeight = 56,
    minItems = 5,
    maxItems = 25,
    reservedHeight = 80,
  } = options;

  const [pageSize, setPageSize] = useState<number>(() => {
    if (typeof window !== 'undefined') {
      const h = window.innerHeight;
      if (h >= 1000) return 14;
      if (h >= 800) return 10;
      return 8;
    }
    return 10;
  });

  const containerRef = useRef<HTMLDivElement>(null);

  const calculatePageSize = useCallback(() => {
    if (containerRef.current) {
      const container = containerRef.current;
      const thead = container.querySelector('thead');
      const paginationBar =
        container.querySelector('.tactical-pagination') ||
        container.querySelector('[class*="pagination"]');
      const firstRow = container.querySelector('tbody tr:not([class*="empty"]):not([class*="loading"])');

      let actualRowHeight = rowHeight;
      if (firstRow) {
        const renderedHeight = firstRow.getBoundingClientRect().height;
        if (renderedHeight >= 28) {
          actualRowHeight = renderedHeight;
        }
      }

      const containerHeight = container.clientHeight;
      const theadHeight = thead ? thead.getBoundingClientRect().height : 36;
      const paginationHeight = paginationBar ? paginationBar.getBoundingClientRect().height : 42;
      const reserved = theadHeight + paginationHeight || reservedHeight;

      const availableBodyHeight = Math.max(0, containerHeight - reserved);
      // Margen de seguridad estricto de 8px para evitar que la última fila se corte
      const safePageSize = Math.max(minItems, Math.min(maxItems, Math.floor((availableBodyHeight - 8) / actualRowHeight)));

      setPageSize((prev) => (prev !== safePageSize ? safePageSize : prev));
      return;
    }

    // Fallback basado en el alto del viewport
    if (typeof window !== 'undefined') {
      const winHeight = window.innerHeight;
      let calculated = 8;
      if (winHeight >= 1050) calculated = Math.floor((winHeight - 280) / rowHeight);
      else if (winHeight >= 900) calculated = Math.floor((winHeight - 250) / rowHeight);
      else if (winHeight >= 750) calculated = Math.floor((winHeight - 220) / rowHeight);
      else calculated = Math.floor((winHeight - 190) / rowHeight);
      const safe = Math.max(minItems, Math.min(maxItems, calculated));
      setPageSize((prev) => (prev !== safe ? safe : prev));
    }
  }, [rowHeight, minItems, maxItems, reservedHeight]);

  useEffect(() => {
    calculatePageSize();

    const element = containerRef.current;
    if (element && typeof ResizeObserver !== 'undefined') {
      const observer = new ResizeObserver(() => {
        calculatePageSize();
      });
      observer.observe(element);
      return () => observer.disconnect();
    }

    const handleResize = () => calculatePageSize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [calculatePageSize]);

  return { pageSize, containerRef, recalculate: calculatePageSize };
}
