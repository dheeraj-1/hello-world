'use strict';

const PORT = process.env.PORT || 3000;
const express = require('express');
const app = express();
app.get('/', function(req, res) {
    res.send("Welcome");
});

app.listen(PORT, function() {
    console.log("Server running on "+ PORT);
});
