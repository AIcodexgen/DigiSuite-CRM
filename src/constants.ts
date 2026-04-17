export const PLAN_COSTS: Record<string, number> = {
  'SEO-Basic': 99,
  'SEO-Pro': 199,
  'SEO-Premium': 299,
  'SMM-Basic': 49,
  'SMM-Pro': 99,
  'SMM-Premium': 149,
  'Combo-Basic': 129,
  'Combo-Pro': 249,
  'Combo-Premium': 399,
};

export const SERVICES = ['SEO', 'SMM', 'Combo'] as const;
export const PACKAGES = ['Basic', 'Pro', 'Premium'] as const;
