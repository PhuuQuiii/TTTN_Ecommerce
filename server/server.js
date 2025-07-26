// Packages
const expressValidator = require("express-validator");
const express = require("express");
const http = require("http");
const cors = require("cors");
require("dotenv").config();
const app = express();
const Fawn = require("fawn");
require("express-async-errors");
const swaggerUi = require("swagger-ui-express");
const swaggerJsDoc = require("swagger-jsdoc");
const socketIO = require("socket.io");
const paypalRoutes = require("./routes/paypalRoutes.js");
// Import methods
const { dbConnection, errorHandler } = require("./middleware/helpers");
const WebSocket = require("ws");

// Database Connection
dbConnection();

// our server instance
const server = http.createServer(app);
// This creates our socket using the instance of the server
const io = socketIO(server);
io.origins([`${process.env.ADMIN_CRM_ROUTE}`]);

// Middlewares
var allowlist = [
  "http://localhost:3000",
  "http://localhost:3003",
  "http://localhost:3002",
  "http://157.245.106.101:3000",
  "http://157.245.106.101:3003",
  "http://157.245.106.101:3002",
];

var corsOptionsDelegate = function (req, callback) {
  var corsOptions;
  if (allowlist.indexOf(req.header("Origin")) !== -1) {
    corsOptions = { origin: true }; // reflect (enable) the requested origin in the CORS response
  } else {
    corsOptions = { origin: false }; // disable CORS for this request
  }
  callback(null, corsOptions); // callback expects two parameters: error and options
};

// app.use(cors(corsOptionsDelegate));
app.use(cors());

app.use((req, res, next) => {
  req.io = io;
  next();
});
app.use(express.json());
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));
app.use(expressValidator());

// Extended: https://swagger.io/specification/#infoObject
const swaggerOptions = {
  swaggerDefinition: {
    info: {
      title: "Ecom API",
      description: "ecommerce API information",
      contact: {
        name: "Amazing Developer",
      },
      servers: ["https://backend-ecommerce-theta-plum.vercel.app"],
      // servers: ["http://localhost:3001/api"],
    },
  },
  apis: ["./controllers/*.js"],
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);

app.use("/api/paypal", paypalRoutes);

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));
// Routes
app.use("/api/admin-auth", require("./routes/admin_auth"));
app.use("/api/user-auth", require("./routes/user_auth"));
app.use("/api/admin", require("./routes/admin"));
app.use("/api/superadmin", require("./routes/superadmin"));
app.use("/api/user", require("./routes/user"));
app.use("/api/product", require("./routes/product"));
app.use("/api/order", require("./routes/order"));
app.use("/api/review-qna", require("./routes/review_qna"));
app.use("/api/cart-wishlist", require("./routes/cart_wishlist"));
app.use("/api/dispatcher-auth", require("./routes/dispatcher_auth"));
app.use("/api/sale", require("./routes/sale"));
app.use("/api/notification", require("./routes/notification"));

// logout for all types of user in the system
app.delete("/api/logout", async (req, res) => {
  const RefreshToken = require("./models/RefereshToken");
  const { refreshToken } = req.body;
  await RefreshToken.deleteOne({ refreshToken });
  res.status(200).json({ msg: "Logged Out" });
});

// Error handling middleware
app.use(function (err, req, res, next) {
  console.log("****SERVER_ERROR****");
  console.log(err); // in lỗi middleware
  if (err.message == "Not Image") {
    return res.status(415).json({ error: "Images are only allowed" });
  }
  return res.status(500).json({
    error: errorHandler(err) || err.message || "Something went wrong!",
  });
});

// Xử lý bên Live stream
const wss = new WebSocket.Server({ server });

app.post("/auth", function (req, res) {
  const streamkey = req.body.key;

  if (streamkey === "supersecret") {
    res.status(200).send();
    return;
  }

  res.status(403).send();
});

let viewers = -1;

wss.on("connection", (ws) => {
  viewers++;
  console.log("New connection, viewers:", viewers);
  broadcastViewers();

  ws.on("message", (message) => {
    console.log("Received message:", message);
    try {
      const parsedMessage = JSON.parse(message);
      // Kiểm tra loại tin nhắn
      if (parsedMessage.type === "comment") {
        // Gửi lại tin nhắn cho tất cả client
        wss.clients.forEach((client) => {
          if (client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify(parsedMessage));
          }
        });
      }
    } catch (error) {
      console.error("Error parsing message:", error);
    }
  });

  ws.on("close", () => {
    viewers--;
    console.log("Connection closed, viewers:", viewers);
    broadcastViewers();
  });

  ws.on("error", (error) => {
    console.error("WebSocket error:", error);
  });
});

function broadcastViewers() {
  const message = JSON.stringify({ type: "viewers", count: viewers });
  console.log("Broadcasting viewers:", viewers);
  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(message);
    }
  });
}

let roller = Fawn.Roller();
roller.roll().then(function () {
  // start server
  const port = process.env.PORT;
  server.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });
});
