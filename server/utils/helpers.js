export const normalizePrice = (priceString) => {
  if (!priceString) return null;
  return Number(priceString.replace(/[^0-9]/g, ''));
};

export const normalizeTitle = (title) => {
  if (!title) return '';
  return title
    .toLowerCase()
    .replace(/\(.*\)/g, '') 
    .replace(/[,|]/g, '')  
    .replace(/\s+/g, ' ')
    .trim();
};