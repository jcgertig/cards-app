export async function getBase64Image(img) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.addEventListener('load', () => resolve(reader.result));
    reader.addEventListener('error', (err) => reject(err));
    reader.readAsDataURL(img);
  });
}
