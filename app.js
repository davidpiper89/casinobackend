require("dotenv").config();
const express = require("express");
const app = express();
const port = 6001;
const auth = require("./middleware/auth");
const cors = require("cors");
const admin = require("firebase-admin");
const serviceAccount = require("./secrets/serviceAccountKey.json");
const cookieParser = require("cookie-parser");
app.use(cookieParser());

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.send("Hello World!");
});

//sub routes
app.use("/signup", require("./routes/signup.js"));
app.use("/login", require("./routes/login.js"));
app.use("/google-login", require("./routes/google-login.js"));

//sub routes need auth
app.use("/update-chips", auth, require("./routes/update-chips"));

app.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`);
});
