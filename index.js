const dotenv=require('dotenv');
const express = require("express");
const app= express();
dotenv.config();

const authRoute=require('./routes/auth')
const userRoute=require('./routes/user');
const godRoure=require('./routes/god');
const wishlistRoute=require("./routes/wishlist_route");
const chalisaMantraRoute=require('./routes/chalisa_aarti');
const panchangRoute = require("./routes/penchang_horscope");
const slokaRoutes = require("./routes/geeta_shola_route");
const todayThoughts = require("./routes/today_thoughts_route");
const vivekanandQuote = require("./routes/vivekandQuotes_route");
const kabirQuote = require("./routes/kabirdoha_route");
const festivalRoutes = require("./routes/festival_route");
const poornimaRoutes = require("./routes/poornima_route");
const anprashanRoutes = require("./routes/anprashan_muhurat_route");
const amavasyaRoutes = require("./routes/amavasya_route");
const ekadashiRoutes = require("./routes/ekadashi_route");
const upanayanRoutes = require("./routes/upanayan_route");
const grihPraveshRoutes = require("./routes/grihpravesh_route");
const mundanRoutes = require("./routes/mundan_route");
const grahanRoutes = require("./routes/grahan_route");
const vivahMuhuratRoutes = require("./routes/vivah_muhurat_route");
const grahGocharRoutes = require("./routes/grah_gochar_route");
const horoscopeRoutes = require("./routes/horoscope_routes");
const rashiRoutes = require("./routes/rashi_name_route");
const trithRoutes = require("./routes/tirth_routes");
const bannerRoutes = require("./routes/bannerRoutes");

const path = require("path");

const mongoose=require("./mongoose_connect"); 

app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));
//app.use(express.json())
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use("/api/auth/",authRoute);
app.use("/api/banner", bannerRoutes);

app.use("/api/poornima", poornimaRoutes);
app.use("/api/tirth", trithRoutes);
app.use("/api/anprashan-muhurat", anprashanRoutes);
app.use("/api/horscope", horoscopeRoutes);
app.use("/api/amavasya", amavasyaRoutes);
app.use("/api/ekadashi", ekadashiRoutes);
app.use("/api/upanayan/",upanayanRoutes);
app.use("/api/festivals/",festivalRoutes);
app.use("/api/grihpravesh", grihPraveshRoutes);
app.use("/api/mundan", mundanRoutes);
app.use("/api/grahan", grahanRoutes);
app.use("/api/vivah-muhurat", vivahMuhuratRoutes);
app.use("/api/grah-gochar", grahGocharRoutes);
app.use("/api/rashi", rashiRoutes);

app.use("/api/vivekanandQuote/",vivekanandQuote);
app.use("/api/kabirQuote/",kabirQuote);
app.use("/api/god/",godRoure);
app.use("/api/thoughts/",todayThoughts);
app.use("/api/panchang/", panchangRoute);
app.use("/api/solaka/", slokaRoutes);
app.use("/api/chalisaaarti/",chalisaMantraRoute);
app.use("/api/wishlist/",wishlistRoute);
app.use("/api/user/",userRoute);


const PORT = process.env.PORT || 8080;
const HOST = '0.0.0.0';

app.listen(PORT, HOST, () => {
  console.log(`Server running on http://${HOST}:${PORT}`);
});
app.get("/health", (req, res) => {
  res.send("OK");
});
