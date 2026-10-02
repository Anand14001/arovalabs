// WooCommerce + WordPress taxonomies, mirroring the reference site's terms,
// including the empty ones whose archive URLs still resolve.

export const productCategories = [
  { id: 16, slug: 'tests', name: 'Tests', parent: null, path: 'tests' },
  { id: 25, slug: 'diabetes-tests', name: 'Diabetes', parent: 'tests', path: 'tests/diabetes-tests' },
  { id: 28, slug: 'liver-profile', name: 'Liver Profile', parent: 'tests', path: 'tests/liver-profile' },
  { id: 26, slug: 'heart-health-tests', name: 'Heart Health', parent: 'tests', path: 'tests/heart-health-tests' },
  { id: 27, slug: 'thyroid', name: 'Thyroid', parent: 'tests', path: 'tests/thyroid' },
  { id: 29, slug: 'vitamins', name: 'Vitamins', parent: 'tests', path: 'tests/vitamins' },
  { id: 49, slug: 'yy-gland', name: 'YY Gland', parent: 'tests', path: 'tests/yy-gland' },

  { id: 19, slug: 'packages', name: 'Packages', parent: null, path: 'packages' },
  { id: 23, slug: 'fitness', name: 'Fitness', parent: 'packages', path: 'packages/fitness' },
  { id: 21, slug: 'heart-health', name: 'Heart Health', parent: 'packages', path: 'packages/heart-health' },
  { id: 50, slug: 'kids-health', name: 'Kids Health', parent: 'packages', path: 'packages/kids-health' },
  { id: 20, slug: 'women-health', name: 'Women Health', parent: 'packages', path: 'packages/women-health' },
  { id: 22, slug: 'senior-citizen', name: 'Senior Citizen', parent: 'packages', path: 'packages/senior-citizen' },
  { id: 24, slug: 'diabetes', name: 'Diabetes', parent: 'packages', path: 'packages/diabetes' },
];

// Back the homepage "Choose Test by Organ" tiles.
export const productTags = [
  { id: 34, slug: 'bone', name: 'Bone', icon: '/assets/rib_cage.svg' },
  { id: 45, slug: 'gall-bladder', name: 'Gall Bladder', icon: '/assets/images.webp' },
  { id: 31, slug: 'heart', name: 'Heart', icon: '/assets/ecg_heart.svg' },
  { id: 33, slug: 'kidney', name: 'Kidney', icon: '/assets/nephrology.svg' },
  { id: 32, slug: 'lungs', name: 'Lungs', icon: '/assets/pulmonology.svg' },
  { id: 35, slug: 'thyroid', name: 'Thyroid', icon: '/assets/endocrinology.svg' },
];

export const blogCategories = [
  { id: 36, slug: 'nutrition', name: 'Nutrition' },
  { id: 43, slug: 'health-tips', name: 'Health Tips' },
  { id: 37, slug: 'cardiology', name: 'Cardiology' },
  { id: 1, slug: 'wellness', name: 'Wellness' },
];

export const getCategoryByPath = (path) =>
  productCategories.find((c) => c.path === path);

export const getTagBySlug = (slug) => productTags.find((t) => t.slug === slug);

export const getBlogCategoryBySlug = (slug) =>
  blogCategories.find((c) => c.slug === slug);

// Default sort options on the reference site's WooCommerce archives.
export const orderByOptions = [
  { value: 'menu_order', label: 'Default sorting' },
  { value: 'popularity', label: 'Sort by popularity' },
  { value: 'rating', label: 'Sort by average rating' },
  { value: 'date', label: 'Sort by latest' },
  { value: 'price', label: 'Sort by price: low to high' },
  { value: 'price-desc', label: 'Sort by price: high to low' },
];
