export type ProductFormState = {
  errors?: Record<string, string[] | undefined>;
  formError?: string;
  success?: boolean;
};

export const productFormInitialState: ProductFormState = {};

export function parseProductImages(input: string) {
  return input
    .split(",")
    .map((url) => url.trim())
    .filter((url) => url.length > 0);
}

