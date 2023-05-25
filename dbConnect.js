const mongoose = require("mongoose");

module.exports = async () => {
  const mongoUri =
    "mongodb+srv://pratik:kV6jQBECaHlyYSEV@cluster0.xhbimtu.mongodb.net/?retryWrites=true&w=majority";

  //   const mongoUri =
  //     "mongodb+srv://0212pratikraj:rHLMsxOMjFmgk2ZA@cluster0.cyk9cpd.mongodb.net/?retryWrites=true&w=majority";

  try {
    const connect = await mongoose.connect(mongoUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log(`MongoDB connected: ${connect.connection.host}`);
  } catch (err) {
    console.log(err);
    process.exit(1);
  }
};
