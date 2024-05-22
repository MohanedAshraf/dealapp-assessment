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
      name: "Admin1",
      phone: "111-111-1111",
      role: "ADMIN",
      password: hashedPassword,
    },
    {
      name: "Admin2",
      phone: "222-222-2222",
      role: "ADMIN",
      password: hashedPassword,
    },
    {
      name: "Agent1",
      phone: "333-333-3333",
      role: "AGENT",
      password: hashedPassword,
    },
    {
      name: "Agent2",
      phone: "444-444-4444",
      role: "AGENT",
      password: hashedPassword,
    },
    {
      name: "Agent3",
      phone: "555-555-5555",
      role: "AGENT",
      password: hashedPassword,
    },
    {
      name: "Client1",
      phone: "666-666-6666",
      role: "CLIENT",
      password: hashedPassword,
    },
    {
      name: "Client2",
      phone: "777-777-7777",
      role: "CLIENT",
      password: hashedPassword,
    },
  ];

  await User.insertMany(users);
  console.log("Users created");
};

const createRequests = async () => {
  const clients = await User.find({ role: "CLIENT" });
  const types = ["VILLA", "HOUSE", "LAND", "APARTMENT"];

  const requests = [];
  for (let i = 0; i < 10; i++) {
    requests.push({
      propertyType: types[i % 4],
      area: 100 + i * 10,
      price: 100000 + i * 100000,
      city: "City" + i,
      district: "District" + i,
      description: `Description for request ${i}`,
      user: clients[i % clients.length]._id,
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
      area: 150,
      price: 300010,
      city: "CityA",
      district: "DistrictA",
      description: "Description for ad 1",
      user: agents[0]._id,
    },
    {
      propertyType: "HOUSE",
      area: 150,
      price: 300010,
      city: "CityB",
      district: "DistrictB",
      description: "Description for ad 1",
      user: agents[0]._id,
    },
    {
      propertyType: "VILLA",
      area: 200,
      price: 499990,
      city: "CityB",
      district: "DistrictB",
      description: "Description for ad 2",
      user: agents[1]._id,
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
