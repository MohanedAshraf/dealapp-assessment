require("dotenv").config();
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const User = require("./models/User");
const PropertyRequest = require("./models/PropertyRequest");
const Ad = require("./models/Ad");

const mongoURI = process.env.MONGO_URI;

mongoose.connect(mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const createUsers = async () => {
  const hashedPassword = await bcrypt.hash("password123", 10);

  const users = [
    {
      name: "Agent",
      phone: "11-111-1111",
      password: hashedPassword,
      role: "AGENT",
      status: "ACTIVE",
    },
    {
      name: "Client",
      phone: "22-222-2222",
      password: hashedPassword,
      role: "CLIENT",
      status: "ACTIVE",
    },
    {
      name: "Admin",
      phone: "33-333-3333",
      password: hashedPassword,
      role: "ADMIN",
      status: "ACTIVE",
    },
  ];

  await User.insertMany(users);
  console.log("Users created");
};

const createRequests = async () => {
  const clients = await User.find({ role: "CLIENT" });

  const requests = [];
  for (let i = 0; i < 30; i++) {
    requests.push({
      propertyType: "HOUSE",
      area: 130,
      price: i % 0 ? 30000 : 29990,
      city: "City" + i,
      district: "District1",
      description: `Description for request ${i}`,
      user: clients[0]._id,
    });
  }

  for (let i = 0; i < 31; i++) {
    requests.push({
      propertyType: "VILLA",
      area: 140,
      price: i % 0 ? 40000 : 39990,
      city: "City" + i,
      district: "District2",
      description: `Description for request ${i}`,
      user: clients[0]._id,
    });
  }
  //not relvant data
  for (let i = 0; i < 31; i++) {
    requests.push({
      propertyType: "LAND",
      area: 220,
      price: 50000,
      city: "City" + i,
      district: "District2",
      description: `Description for request ${i}`,
      user: clients[0]._id,
    });
  }

  await PropertyRequest.insertMany(requests);
  console.log("Property requests created");
};

const createAds = async () => {
  const agents = await User.find({ role: "AGENT" });
  const ads = [
    {
      propertyType: "HOUSE",
      area: 130,
      price: 30000,
      city: "CityA",
      district: "District1",
      description: "Description for ad 1",
      user: agents[0]._id,
    },
    {
      propertyType: "VILLA",
      area: 140,
      price: 40000,
      city: "CityB",
      district: "District2",
      description: "Description for ad 1",
      user: agents[0]._id,
    },
    {
      propertyType: "VILLA",
      area: 200,
      price: 499990,
      city: "CityB",
      district: "District3",
      description: "Description for ad 2",
      user: agents[0]._id,
    },
  ];

  await Ad.insertMany(ads);
  console.log("Ads created");
};

const seedDatabase = async () => {
  try {
    await createUsers();
    await createRequests();
    await createAds();
    mongoose.connection.close();
    console.log("Database seeded");
  } catch (err) {
    console.error(err);
    mongoose.connection.close();
  }
};

seedDatabase();
