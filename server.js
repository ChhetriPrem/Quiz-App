const express = require("express");
const path = require("path");
const fs = require("fs").promises;

const app = express();
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));
let postedData = null;
app.post("/save", async (req, res) => {
  const { username, email } = req.body;
  const newUser = {
    username: username,
    email: email,
    score: 0,
  };
  postedData = req.body;
  try {
    // Read the existing data
    const data = await fs.readFile("db.json", "utf8");
    const jsonData = JSON.parse(data);

    // Add the new user to the existing users array
    jsonData.users.push(newUser);

    // Convert updated data to JSON
    const updatedData = JSON.stringify(jsonData, null, 2);

    // Write the updated data to the file
    await fs.writeFile("db.json", updatedData);

    console.log("File has been updated with new data");

    res.status(200).json({ message: "Data saved successfully!" });
  } catch (err) {
    console.error("Error processing file:", err);
  }
});

app.get("/success", (req, res) => {
 
    // Send the HTML file as the response
    res.sendFile(path.join(__dirname, "public", "main.html"));
 
});


app.get("/data", (req, res) => {
  if (postedData) {
    res.status(200).json(postedData); // Send the stored data
  } else {
    res.status(404).json({ message: "No data found" });
  }
});


app.listen(3002, () => {
  console.log("Server running on port 3002");
});
