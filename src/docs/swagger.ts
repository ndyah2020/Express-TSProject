const swaggerSpec = {
  openapi: "3.0.0",
  info: {
    title: "Express TS Project API",
    version: "1.0.0",
    description: "API documentation for Express-TSProject",
  },
  servers: [
    {
      url: "http://localhost:5000",
      description: "Local development server",
    },
  ],
  tags: [
    { name: "Auth" },
    { name: "Users" },
    { name: "Products" },
    { name: "Categories" },
    { name: "Orders" },
    { name: "Customers" },
    { name: "Suppliers" },
  ],
  paths: {
    "/api/auth/register": {
      post: {
        tags: ["Auth"],
        summary: "Register account",
        responses: { "200": { description: "Success" } },
      },
    },
    "/api/auth/login": {
      post: {
        tags: ["Auth"],
        summary: "Login",
        responses: { "200": { description: "Success" } },
      },
    },
    "/api/auth/logout": {
      get: {
        tags: ["Auth"],
        summary: "Logout",
        responses: { "200": { description: "Success" } },
      },
    },
    "/api/auth/refresh-token": {
      post: {
        tags: ["Auth"],
        summary: "Refresh access token",
        responses: { "200": { description: "Success" } },
      },
    },

    "/api/users/get": {
      get: {
        tags: ["Users"],
        summary: "Get users",
        responses: { "200": { description: "Success" } },
      },
    },
    "/api/users/get/{id}": {
      get: {
        tags: ["Users"],
        summary: "Get user by id",
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "string" },
          },
        ],
        responses: { "200": { description: "Success" } },
      },
    },

    "/api/products": {
      get: {
        tags: ["Products"],
        summary: "Get products",
        responses: { "200": { description: "Success" } },
      },
      post: {
        tags: ["Products"],
        summary: "Create product",
        responses: { "201": { description: "Created" } },
      },
    },
    "/api/products/{id}": {
      get: {
        tags: ["Products"],
        summary: "Get product by id",
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "string" },
          },
        ],
        responses: { "200": { description: "Success" } },
      },
      put: {
        tags: ["Products"],
        summary: "Update product",
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "string" },
          },
        ],
        responses: { "200": { description: "Success" } },
      },
    },

    "/api/categories/get": {
      get: {
        tags: ["Categories"],
        summary: "Get categories",
        responses: { "200": { description: "Success" } },
      },
    },
    "/api/categories/get/{id}": {
      get: {
        tags: ["Categories"],
        summary: "Get category by id",
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "string" },
          },
        ],
        responses: { "200": { description: "Success" } },
      },
    },
    "/api/categories/create": {
      post: {
        tags: ["Categories"],
        summary: "Create category",
        responses: { "201": { description: "Created" } },
      },
    },
    "/api/categories/update/{id}": {
      patch: {
        tags: ["Categories"],
        summary: "Update category",
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "string" },
          },
        ],
        responses: { "200": { description: "Success" } },
      },
    },
    "/api/categories/delete/{id}": {
      delete: {
        tags: ["Categories"],
        summary: "Delete category",
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "string" },
          },
        ],
        responses: { "200": { description: "Success" } },
      },
    },

    "/api/orders/get": {
      get: {
        tags: ["Orders"],
        summary: "Get orders",
        responses: { "200": { description: "Success" } },
      },
    },
    "/api/orders/get/time-range": {
      get: {
        tags: ["Orders"],
        summary: "Get orders by time range",
        responses: { "200": { description: "Success" } },
      },
    },
    "/api/orders/get/customer/{customerId}": {
      get: {
        tags: ["Orders"],
        summary: "Get orders by customer",
        parameters: [
          {
            name: "customerId",
            in: "path",
            required: true,
            schema: { type: "string" },
          },
        ],
        responses: { "200": { description: "Success" } },
      },
    },
    "/api/orders/get/seller/{sellerId}": {
      get: {
        tags: ["Orders"],
        summary: "Get orders by seller",
        parameters: [
          {
            name: "sellerId",
            in: "path",
            required: true,
            schema: { type: "string" },
          },
        ],
        responses: { "200": { description: "Success" } },
      },
    },
    "/api/orders/get/{id}": {
      get: {
        tags: ["Orders"],
        summary: "Get order by id",
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "string" },
          },
        ],
        responses: { "200": { description: "Success" } },
      },
    },
    "/api/orders/create": {
      post: {
        tags: ["Orders"],
        summary: "Create order",
        responses: { "201": { description: "Created" } },
      },
    },

    "/api/customers/get": {
      get: {
        tags: ["Customers"],
        summary: "Get customers",
        responses: { "200": { description: "Success" } },
      },
    },
    "/api/customers/get/{id}": {
      get: {
        tags: ["Customers"],
        summary: "Get customer by id",
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "string" },
          },
        ],
        responses: { "200": { description: "Success" } },
      },
    },
    "/api/customers/create": {
      post: {
        tags: ["Customers"],
        summary: "Create customer",
        responses: { "201": { description: "Created" } },
      },
    },
    "/api/customers/update/{id}": {
      patch: {
        tags: ["Customers"],
        summary: "Update customer",
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "string" },
          },
        ],
        responses: { "200": { description: "Success" } },
      },
    },
    "/api/customers/delete/{id}": {
      delete: {
        tags: ["Customers"],
        summary: "Delete customer",
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "string" },
          },
        ],
        responses: { "200": { description: "Success" } },
      },
    },

    "/api/suppliers/get": {
      get: {
        tags: ["Suppliers"],
        summary: "Get suppliers",
        responses: { "200": { description: "Success" } },
      },
    },
    "/api/suppliers/get/{id}": {
      get: {
        tags: ["Suppliers"],
        summary: "Get supplier by id",
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "string" },
          },
        ],
        responses: { "200": { description: "Success" } },
      },
    },
    "/api/suppliers/create": {
      post: {
        tags: ["Suppliers"],
        summary: "Create supplier",
        responses: { "201": { description: "Created" } },
      },
    },
    "/api/suppliers/update/{id}": {
      patch: {
        tags: ["Suppliers"],
        summary: "Update supplier",
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "string" },
          },
        ],
        responses: { "200": { description: "Success" } },
      },
    },
    "/api/suppliers/delete/{id}": {
      delete: {
        tags: ["Suppliers"],
        summary: "Delete supplier",
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "string" },
          },
        ],
        responses: { "200": { description: "Success" } },
      },
    },
  },
};

export default swaggerSpec;
