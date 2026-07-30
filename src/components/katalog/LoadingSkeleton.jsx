import React from 'react';

export const ProductCardSkeleton = () => {
  return (
    <div className="bg-surface rounded-xl border border-border shadow-soft-sm p-2 animate-pulse">
      <div className="bg-slate-200 rounded-lg aspect-square w-full mb-2"></div>
      <div className="h-3 bg-slate-200 rounded w-3/4 mb-1.5"></div>
      <div className="h-2.5 bg-slate-200 rounded w-1/2 mb-2"></div>
      <div className="flex items-center justify-between">
        <div className="h-3.5 bg-slate-200 rounded w-1/3"></div>
        <div className="h-2.5 bg-slate-200 rounded w-1/4"></div>
      </div>
    </div>
  );
};

export const ProductsGridSkeleton = ({ count = 8 }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
      {[...Array(count)].map((_, i) => (
        <ProductCardSkeleton key={i} />
      ))}
    </div>
  );
};

export const ProductsListSkeleton = ({ count = 5 }) => {
  return (
    <div className="space-y-2">
      {[...Array(count)].map((_, i) => (
        <div key={i} className="bg-surface rounded-xl border border-border shadow-soft-sm p-2.5 animate-pulse">
          <div className="flex gap-2.5">
            <div className="w-16 h-16 bg-slate-200 rounded-lg"></div>
            <div className="flex-1">
              <div className="h-3 bg-slate-200 rounded w-3/4 mb-1.5"></div>
              <div className="h-2.5 bg-slate-200 rounded w-1/2 mb-2"></div>
              <div className="flex gap-2">
                <div className="h-3 bg-slate-200 rounded w-1/4"></div>
                <div className="h-2.5 bg-slate-200 rounded w-1/6"></div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export const BrandsGridSkeleton = ({ count = 6 }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {[...Array(count)].map((_, i) => (
        <div key={i} className="bg-surface rounded-xl border border-border shadow-soft-sm p-4 animate-pulse">
          <div className="w-20 h-20 bg-slate-200 rounded-full mx-auto mb-3"></div>
          <div className="h-4 bg-slate-200 rounded w-24 mx-auto mb-2"></div>
          <div className="h-3 bg-slate-200 rounded w-16 mx-auto"></div>
        </div>
      ))}
    </div>
  );
};

export const CategoriesGridSkeleton = ({ count = 5 }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {[...Array(count)].map((_, i) => (
        <div key={i} className="bg-surface rounded-2xl border border-border shadow-soft-sm p-5 animate-pulse">
          <div className="w-[60px] h-[60px] bg-slate-200 rounded-xl mx-auto mb-3"></div>
          <div className="h-5 bg-slate-200 rounded w-24 mx-auto mb-2"></div>
          <div className="h-3 bg-slate-200 rounded w-32 mx-auto"></div>
        </div>
      ))}
    </div>
  );
};

// Skeleton untuk Hero Section
export const HeroSkeleton = () => {
  return (
    <div className="hero rounded-2xl overflow-hidden bg-slate-200 animate-pulse">
      <div className="p-[clamp(30px,6vw,60px)] flex flex-col items-center justify-center text-center">
        <div className="w-20 h-20 bg-slate-300 rounded-full mb-5"></div>
        <div className="h-10 bg-slate-300 rounded w-48 mb-2"></div>
        <div className="h-6 bg-slate-300 rounded w-64 mb-4"></div>
        <div className="h-8 bg-slate-300 rounded w-32 mb-6"></div>
        <div className="flex gap-3">
          <div className="h-12 bg-slate-300 rounded-xl w-36"></div>
        </div>
      </div>
    </div>
  );
};

export const HubSkeleton = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {[...Array(8)].map((_, i) => (
        <div key={i} className="bg-surface rounded-2xl border border-border shadow-soft-sm p-5 animate-pulse">
          <div className="w-[60px] h-[60px] bg-slate-200 rounded-xl mx-auto mb-3"></div>
          <div className="h-5 bg-slate-200 rounded w-28 mx-auto mb-2"></div>
          <div className="h-3 bg-slate-200 rounded w-36 mx-auto"></div>
        </div>
      ))}
    </div>
  );
};

export const PriceGridSkeleton = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {[...Array(5)].map((_, i) => (
        <div key={i} className="bg-surface rounded-2xl border border-border shadow-soft-sm p-5 animate-pulse">
          <div className="w-[60px] h-[60px] bg-slate-200 rounded-xl mx-auto mb-3"></div>
          <div className="h-5 bg-slate-200 rounded w-24 mx-auto mb-2"></div>
          <div className="h-3 bg-slate-200 rounded w-32 mx-auto"></div>
        </div>
      ))}
    </div>
  );
};

export const InterestGridSkeleton = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {[...Array(6)].map((_, i) => (
        <div key={i} className="bg-surface rounded-2xl border border-border shadow-soft-sm p-5 animate-pulse">
          <div className="w-[60px] h-[60px] bg-slate-200 rounded-xl mx-auto mb-3"></div>
          <div className="h-5 bg-slate-200 rounded w-28 mx-auto mb-2"></div>
          <div className="h-3 bg-slate-200 rounded w-36 mx-auto"></div>
        </div>
      ))}
    </div>
  );
};

export const LoadingWithMessage = ({ message = "Memuat data..." }) => {
  return (
    <div className="flex flex-col items-center justify-center py-12">
      <div className="relative">
        <div className="w-16 h-16 border-4 border-border border-t-blue-600 rounded-full animate-spin"></div>
      </div>
      <p className="mt-4 text-sm text-content-muted">{message}</p>
    </div>
  );
};

export default {
  ProductCardSkeleton,
  ProductsGridSkeleton,
  ProductsListSkeleton,
  BrandsGridSkeleton,
  CategoriesGridSkeleton,
  HeroSkeleton,
  HubSkeleton,
  PriceGridSkeleton,
  InterestGridSkeleton,
  LoadingWithMessage
};