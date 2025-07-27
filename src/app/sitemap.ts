import { MetadataRoute } from 'next'
import { createClient } from '@/utils/supabase/server'

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const supabase = createClient();
  
  const staticRoutes = [
    '',
    '/about',
    '/selling',
    '/for-sale',
    '/for-rent',
    '/landlords',
    '/contact',
    '/valuation',
    '/testimonials',
    '/available-properties',
  ].map((route) => ({
    url: `${BASE_URL}${route}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: route === '' ? 1 : 0.8,
  }));

  // Fetch all properties for dynamic routes
  const { data: properties, error: propertiesError } = await supabase
    .from('properties')
    .select('slug, updated_at')
    .eq('status', 'available');

  if (propertiesError) {
    console.error('Error fetching properties for sitemap:', propertiesError);
    return staticRoutes;
  }

  const propertyRoutes = properties.map(({ slug, updated_at }) => ({
    url: `${BASE_URL}/property/${slug}`,
    lastModified: new Date(updated_at),
    changeFrequency: 'daily' as const,
    priority: 0.9,
  }));
  
  // Fetch all regions for dynamic routes
  const { data: regions, error: regionsError } = await supabase
      .from('regions')
      .select('slug, updated_at');

  if (regionsError) {
    console.error('Error fetching regions for sitemap:', regionsError);
    return [...staticRoutes, ...propertyRoutes];
  }

  const saleRegionRoutes = regions.map(({ slug, updated_at }) => ({
      url: `${BASE_URL}/for-sale-${slug}`,
      lastModified: new Date(updated_at),
      changeFrequency: 'weekly' as const,
      priority: 0.7,
  }));

  const rentRegionRoutes = regions.map(({ slug, updated_at }) => ({
      url: `${BASE_URL}/to-rent-${slug}`,
      lastModified: new Date(updated_at),
      changeFrequency: 'weekly' as const,
      priority: 0.7,
  }));


  return [...staticRoutes, ...propertyRoutes, ...saleRegionRoutes, ...rentRegionRoutes];
}
