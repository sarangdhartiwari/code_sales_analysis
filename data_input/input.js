import fs from "fs";
import path from "path";
import * as db from "../db/db.js";

const csvFilePath = "./sample.csv";

export const readCSVFileAndInsertData = async () => {
  if (fs.existsSync(csvFilePath) === false) {
    throw new Error(`File not found : ${csvFilePath}`);
  }

  // Read CSV
  var f = fs.readFileSync(csvFilePath, { encoding: "utf-8" }, function (err) {
    console.log(err);
  });

  // Split on row
  f = f.split("\n");

  // Get first row for column headers
  const headers = f.shift().split(",");

  var json = [];
  f.forEach(function (d) {
    // Loop through each row
    let tmp = {};
    let row = d.split(",");
    for (var i = 0; i < headers.length; i++) {
      let col = headers[i].replace(" ", "").replace(" ", "").replace("\r", "");
      tmp[col] = row[i];
    }
    // Add object to list
    json.push(tmp);
  });

  saveToDatabase(json);
};

const saveToDatabase = async (json) => {
  json.forEach((row) => {
    if (row.OrderID && row.CustomerID && row.ProductID) {
      row.UnitPrice = 0 + +row.UnitPrice;
      row.Discount = 0 + +row.Discount;
      row.QuantitySold = 0 + +row.QuantitySold;
      row.ShippingCost = 0 + +row.ShippingCost;
      row.DateofSale = new Date(row.DateofSale);

      const customerQuery = `INSERT INTO customers (id,name,email,address) VALUES ($1,$2,$3,$4)`;
      const customerParams = [
        row.CustomerID,
        row.CustomerName,
        row.CustomerEmail,
        row.CustomerAddress,
      ];

      const productQuery = `INSERT INTO products (id,name,category,price) VALUES ($1,$2,$3,$4)`;
      const productParams = [
        row.ProductID,
        row.ProductName,
        row.Category,
        row.UnitPrice,
      ];

      const orderQuery = `INSERT INTO orders (id,customer_id,product_id,region, date_of_sale,
                          qty_sold,discount, shipping_cost, payment_method)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)`;

      const orderParams = [
        row.OrderID,
        row.ProductID,
        row.CustomerID,
        row.Region,
        row.DateofSale,
        row.QuantitySold,
        row.Discount,
        row.ShippingCost,
        row.PaymentMethod,
      ];

      console.log(productQuery);
      console.log(customerQuery);
      console.log(orderQuery);

      let productResult = db.queryDatabase(productQuery, productParams);
      let customerResult = db.queryDatabase(customerQuery, customerParams);
      let orderResult = db.queryDatabase(orderQuery, orderParams);

      console.log(productResult);
      console.log(customerResult);
      console.log(orderResult);
    }
  });

  //     customers	id,name,email,address
  // products	id,name,category,price
  // orders	id,customer_id,product_id,region, date_of_sale,qty_sold,discount, shipping_cost, payment_method
};
