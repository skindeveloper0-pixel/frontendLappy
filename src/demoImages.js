export function demoLaptopImage(item) {
  const image = item.brand === 'Apple' ? 'laptop-silver.jpg' : item.brand === 'Dell' || item.color === 'dark' || item.color === 'black' ? 'laptop-dark.jpg' : 'laptop-work.jpg';
  return `${import.meta.env.BASE_URL}images/${image}`;
}
