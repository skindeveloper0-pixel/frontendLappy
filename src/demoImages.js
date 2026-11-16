export function demoLaptopImage(item) {
  const image = item.brand === 'Apple' ? 'laptop-silver.jpg' : item.brand === 'Dell' || item.color === 'dark' || item.color === 'black' ? 'laptop-dark.jpg' : 'laptop-work.jpg';
  return `${import.meta.env.BASE_URL}images/${image}`;
}

export function productImages(item) {
  if (item.photos?.length) return item.photos;
  const cover = demoLaptopImage(item);
  const samples = ['laptop-silver.jpg', 'laptop-dark.jpg', 'laptop-work.jpg'].map(name => `${import.meta.env.BASE_URL}images/${name}`);
  return [cover, ...samples.filter(url => url !== cover)];
}
