"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var dotenv_1 = require("dotenv");
var mongoose_1 = require("mongoose");
var Product_js_1 = require("../src/models/Product.js");
var Category_js_1 = require("../src/models/Category.js");
dotenv_1.default.config();
var productsByCategory = {
    'Living Room': [
        {
            name: 'Modern Sofa Set',
            description: 'Comfortable 3-piece modern sofa set with premium fabric upholstery',
            price: 1299.99,
            image: '/products/living-room/sofa-set.jpg'
        },
        {
            name: 'Coffee Table',
            description: 'Elegant glass-top coffee table with wooden legs',
            price: 299.99,
            image: '/products/living-room/coffee-table.jpg'
        },
        {
            name: 'Floor Lamp',
            description: 'Contemporary floor lamp with adjustable brightness',
            price: 149.99,
            image: '/products/living-room/floor-lamp.jpg'
        },
        {
            name: 'TV Stand',
            description: 'Modern TV stand with storage compartments',
            price: 399.99,
            image: '/products/living-room/tv-stand.jpg'
        }
    ],
    'Bedroom': [
        {
            name: 'Queen Bed Frame',
            description: 'Solid wood queen bed frame with upholstered headboard',
            price: 799.99,
            image: '/products/bedroom/queen-bed.jpg'
        },
        {
            name: 'Nightstand Set',
            description: 'Matching pair of bedside nightstands with drawers',
            price: 249.99,
            image: '/products/bedroom/nightstand.jpg'
        },
        {
            name: 'Dresser',
            description: '6-drawer dresser with mirror',
            price: 549.99,
            image: '/products/bedroom/dresser.jpg'
        },
        {
            name: 'Table Lamp',
            description: 'Bedside table lamp with fabric shade',
            price: 79.99,
            image: '/products/bedroom/table-lamp.jpg'
        }
    ],
    'Dining Room': [
        {
            name: 'Dining Table Set',
            description: '6-seater dining table with matching chairs',
            price: 899.99,
            image: '/products/dining-room/dining-set.jpg'
        },
        {
            name: 'Dining Chairs',
            description: 'Set of 4 upholstered dining chairs',
            price: 299.99,
            image: '/products/dining-room/dining-chairs.jpg'
        },
        {
            name: 'Buffet Cabinet',
            description: 'Storage buffet cabinet for dining room',
            price: 649.99,
            image: '/products/dining-room/buffet.jpg'
        },
        {
            name: 'Chandelier',
            description: 'Crystal chandelier for dining room',
            price: 449.99,
            image: '/products/dining-room/chandelier.jpg'
        }
    ],
    'Office': [
        {
            name: 'Office Desk',
            description: 'L-shaped office desk with built-in storage',
            price: 499.99,
            image: '/products/office/office-desk.jpg'
        },
        {
            name: 'Office Chair',
            description: 'Ergonomic office chair with lumbar support',
            price: 299.99,
            image: '/products/office/office-chair.jpg'
        },
        {
            name: 'Bookshelf',
            description: '5-tier wooden bookshelf',
            price: 199.99,
            image: '/products/office/bookshelf.jpg'
        },
        {
            name: 'Desk Lamp',
            description: 'LED desk lamp with USB charging port',
            price: 89.99,
            image: '/products/office/desk-lamp.jpg'
        }
    ],
    'Storage': [
        {
            name: 'Storage Cabinet',
            description: 'Multi-purpose storage cabinet with doors',
            price: 349.99,
            image: '/products/storage/storage-cabinet.jpg'
        },
        {
            name: 'Storage Bins',
            description: 'Set of 6 fabric storage bins',
            price: 59.99,
            image: '/products/storage/storage-bins.jpg'
        },
        {
            name: 'Shoe Rack',
            description: '3-tier wooden shoe rack',
            price: 79.99,
            image: '/products/storage/shoe-rack.jpg'
        },
        {
            name: 'Storage Ottoman',
            description: 'Upholstered ottoman with hidden storage',
            price: 129.99,
            image: '/products/storage/storage-ottoman.jpg'
        }
    ],
    'Outdoor': [
        {
            name: 'Patio Set',
            description: '4-piece outdoor patio furniture set',
            price: 699.99,
            image: '/products/outdoor/patio-set.jpg'
        },
        {
            name: 'Garden Chair',
            description: 'Weather-resistant outdoor chairs',
            price: 149.99,
            image: '/products/outdoor/garden-chair.jpg'
        },
        {
            name: 'Outdoor Table',
            description: 'Teak wood outdoor dining table',
            price: 399.99,
            image: '/products/outdoor/outdoor-table.jpg'
        },
        {
            name: 'Umbrella',
            description: 'Large patio umbrella with UV protection',
            price: 179.99,
            image: '/products/outdoor/umbrella.jpg'
        }
    ]
};
function seed() {
    return __awaiter(this, void 0, void 0, function () {
        var categories, _loop_1, _i, categories_1, category, totalProducts, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 12, , 13]);
                    console.log('Connecting to MongoDB...');
                    return [4 /*yield*/, mongoose_1.default.connect(process.env.MONGO_URI)];
                case 1:
                    _a.sent();
                    console.log('Connected to MongoDB');
                    console.log('Clearing existing products...');
                    return [4 /*yield*/, Product_js_1.default.deleteMany({})];
                case 2:
                    _a.sent();
                    console.log('Fetching categories...');
                    return [4 /*yield*/, Category_js_1.default.find({})];
                case 3:
                    categories = _a.sent();
                    if (!(categories.length === 0)) return [3 /*break*/, 5];
                    console.log('No categories found. Please run seedCategories first.');
                    return [4 /*yield*/, mongoose_1.default.disconnect()];
                case 4:
                    _a.sent();
                    return [2 /*return*/];
                case 5:
                    console.log('Creating products for each category...');
                    _loop_1 = function (category) {
                        var categoryProducts, productsToInsert;
                        return __generator(this, function (_b) {
                            switch (_b.label) {
                                case 0:
                                    categoryProducts = productsByCategory[category.name];
                                    if (!categoryProducts) return [3 /*break*/, 2];
                                    console.log("Adding products for category: ".concat(category.name));
                                    productsToInsert = categoryProducts.map(function (product) { return (__assign(__assign({}, product), { categoryId: category._id })); });
                                    return [4 /*yield*/, Product_js_1.default.insertMany(productsToInsert)];
                                case 1:
                                    _b.sent();
                                    console.log("Added ".concat(productsToInsert.length, " products for ").concat(category.name));
                                    _b.label = 2;
                                case 2: return [2 /*return*/];
                            }
                        });
                    };
                    _i = 0, categories_1 = categories;
                    _a.label = 6;
                case 6:
                    if (!(_i < categories_1.length)) return [3 /*break*/, 9];
                    category = categories_1[_i];
                    return [5 /*yield**/, _loop_1(category)];
                case 7:
                    _a.sent();
                    _a.label = 8;
                case 8:
                    _i++;
                    return [3 /*break*/, 6];
                case 9:
                    console.log('Products seeded successfully!');
                    return [4 /*yield*/, Product_js_1.default.countDocuments()];
                case 10:
                    totalProducts = _a.sent();
                    console.log("Total products in database: ".concat(totalProducts));
                    return [4 /*yield*/, mongoose_1.default.disconnect()];
                case 11:
                    _a.sent();
                    console.log('Disconnected from MongoDB');
                    return [3 /*break*/, 13];
                case 12:
                    error_1 = _a.sent();
                    console.error('Error seeding products:', error_1);
                    process.exit(1);
                    return [3 /*break*/, 13];
                case 13: return [2 /*return*/];
            }
        });
    });
}
seed();
