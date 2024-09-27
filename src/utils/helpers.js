export const transformCatalog = (catalog) => {
	for (let i = 0; i < catalog.length; i++) {
		if (catalog[i]?.children) {
			if (!Array.isArray(catalog[i]?.children)) {
				catalog[i].children = Object.values(catalog[i]?.children);
			}

			transformCatalog(catalog[i].children);
		}
	}
	return catalog;
};
