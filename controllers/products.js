const Product = require("../models/product");

const getAllProducts = async (req, res) => {
  const { featured, brand, name, sort, fields, numericFilters } = req.query;

  const queryObject = {};

  // Filters
  if (featured) {
    queryObject.featured = featured === "true" ? true : false;
  }

  if (brand) {
    queryObject.brand = brand;
  }

  if (name) {
    queryObject.name = { $regex: name, $options: "i" };
  }

  if (numericFilters) {
    const operatorMap = {
      ">": "$gt",
      ">=": "$gte",
      "=": "$eq",
      "<": "$lt",
      "<=": "$lte",
    };
    const regEx = /\b( < | > | > = | = |< | < =)\b/g;
    let filters = numericFilters.replace(regEx, (match) => `-${operatorMap[match]}-`);
    const options = ["price", "rating"];
    filters = filters.split(",").forEach((item) => {
      const [field, operator, value] = item.split("-");
      if (options.includes(field)) {
        queryObject[field] = { [operator]: Number(value) };
      }
    });
  }

  let result = Product.find(queryObject);

  // Sort
  if (sort) {
    const sortedList = sort.split(",").join(" ");
    result = result.sort(sortedList);
  } else {
    result = result.sort("createdAt");
  }

  // Select fields
  if (fields) {
    const fieldList = fields.split(",").join(" ");
    result = result.select(fieldList);
  }

  // Pagination
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  result = result.skip(skip).limit(limit);

  const products = await result;

  res.status(200).json({ products, total: products.length });
};

module.exports = { getAllProducts };
