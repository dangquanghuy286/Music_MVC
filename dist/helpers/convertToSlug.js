"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.convertToSlug = void 0;
const unidecode_1 = __importDefault(require("unidecode"));
const convertToSlug = (text) => {
    // Bỏ dấu, chuyển ký tự đặc biệt
    const unidecodeText = (0, unidecode_1.default)(text);
    // Thay khoảng trắng bằng dấu gạch ngang, chuyển về lowercase
    const slug = unidecodeText
        .toLowerCase()
        .replace(/\s+/g, "-") // khoảng trắng -> -
        .replace(/[^a-z0-9\-]/g, "") // bỏ ký tự không hợp lệ
        .replace(/-+/g, "-") // bỏ nhiều dấu - liên tiếp
        .replace(/^-+|-+$/g, ""); // bỏ - ở đầu/cuối
    return slug;
};
exports.convertToSlug = convertToSlug;
//# sourceMappingURL=convertToSlug.js.map