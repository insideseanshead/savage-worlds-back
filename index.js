var express = require('express');
require('dotenv').config();
// Sets up express app
// ============================================================
var app = express();
var PORT = process.env.PORT || 8000;
// const cors = requre('cors')
var allRoutes = require('./controllers');

// Requiring modesl for syncing
var db = require('./models');

// Sets up express app  to handle data parsing
app.use(express.urlencoded({extended:true}));
app.use(express.json());

//Production CORS
// app.use(cors({
//     origin: [""]
// }))

// DEV CORS
// app.use(cors());

app.use('/', allRoutes);

db.sequelize.sync({ force: false }).then(function() {
    app.listen(PORT, function(){
        console.log(`App listenting on PORT ${PORT}`);
    });
});