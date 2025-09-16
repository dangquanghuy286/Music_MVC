import unidecode from "unidecode";

export const convertToSlug = (text: string): string => {
  // Bỏ dấu, chuyển ký tự đặc biệt
  const unidecodeText = unidecode(text);

  // Thay khoảng trắng bằng dấu gạch ngang, chuyển về lowercase
  const slug: string = unidecodeText
    .toLowerCase()
    .replace(/\s+/g, "-") // khoảng trắng -> -
    .replace(/[^a-z0-9\-]/g, "") // bỏ ký tự không hợp lệ
    .replace(/-+/g, "-") // bỏ nhiều dấu - liên tiếp
    .replace(/^-+|-+$/g, ""); // bỏ - ở đầu/cuối

  return slug;
};
