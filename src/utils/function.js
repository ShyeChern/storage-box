export const sortBy = (field, reverse, primer) => {
	const key = primer ? (x) => primer(x[field]) : (x) => x[field];

	reverse = reverse ? -1 : 1;

	return function (a, b) {
		a = key(a);
		b = key(b);

		return reverse * ((a > b) - (b > a));
	};
};
