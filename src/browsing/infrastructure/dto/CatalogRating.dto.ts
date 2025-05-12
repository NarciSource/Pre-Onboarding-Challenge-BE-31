type CatalogRatingDTO = {
  average: number;
  count: number;
  distribution: {
    "5": number;
    "4": number;
    "3": number;
    "2": number;
    "1": number;
  };
};

export default CatalogRatingDTO;
