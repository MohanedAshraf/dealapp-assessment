const chai = require("chai");
const chaiHttp = require("chai-http");
const request = require("supertest");
let sinon = require("sinon");
const express = require("express");

const User = require("../models/User");
const errorHandler = require("../middlewares/error.js");

chai.use(chaiHttp);
const expect = chai.expect;

describe("GET /api/v1/stats/overview", () => {
  let app;
  let protectStub;
  let authorizeStub;
  let userAggregateStub;

  function setupApp() {
    delete require.cache[require.resolve("../routes/statistics")];
    const statisticsRouter = require("../routes/statistics");
    app = express();
    app.use(express.json());
    app.use("/api/v1/stats", statisticsRouter);
    app.use(errorHandler);
  }

  beforeEach(() => {
    const auth = require("../middlewares/auth");

    // Stub the protect and authorize middlewares
    protectStub = sinon
      .stub(auth, "protect")
      .callsFake(function (req, res, next) {
        req.user = { id: "mockUserId", role: "ADMIN" };
        next();
      });

    authorizeStub = sinon.stub(auth, "authorize").callsFake(function () {
      return function (req, res, next) {
        return next();
      };
    });

    // Stub the User aggregate method
    userAggregateStub = sinon.stub(User, "aggregate");
    setupApp();
  });

  afterEach(() => {
    // Restore the stubs
    protectStub.restore();
    authorizeStub.restore();
    userAggregateStub.restore();
  });

  it("should return statistics successfully", async () => {
    userAggregateStub.resolves([
      {
        data: [
          {
            name: "Mohaned Ashraf",
            phone: "123-456-7890",
            role: "CLIENT",
            status: "ACTIVE",
            adsCount: 0,
            totalAdsAmount: 0,
            requestsCount: 4,
            totalRequestsAmount: 600000,
          },
        ],
        totalCount: [{ count: 1 }],
      },
    ]);

    const res = await request(app)
      .get("/api/v1/stats/overview")
      .set("Authorization", "Bearer anything");

    expect(res.status).to.equal(200);
    expect(res.body).to.have.property("data").that.is.an("array");
    expect(res.body.data[0]).to.include({
      name: "Mohaned Ashraf",
      phone: "123-456-7890",
    });
  });

  it("should handle no users in the database", async () => {
    userAggregateStub.resolves([
      {
        data: [],
        totalCount: [{ count: 0 }],
      },
    ]);

    const res = await request(app)
      .get("/api/v1/stats/overview")
      .set("Authorization", "Bearer anything");

    expect(res.status).to.equal(200);
    expect(res.body).to.have.property("data").that.is.an("array").that.is.empty;
  });

  it("should handle error if no token provided", async () => {
    protectStub.restore();
    setupApp();
    const res = await request(app).get("/api/v1/stats/overview");

    expect(res.status).to.equal(401);
    expect(res.body).to.have.property("error");
  });

  it("should handle error if user is not admin", async () => {
    authorizeStub.restore();

    protectStub = protectStub.callsFake((req, res, next) => {
      req.user = { _id: "mockUserId", role: "CLIENT" };
      next();
    });

    setupApp();

    const res = await request(app)
      .get("/api/v1/stats/overview")
      .set("Authorization", "Bearer anything");

    expect(res.status).to.equal(403);
    expect(res.body).to.have.property("error");
  });

  it("should handle error if access without token", async () => {
    protectStub.restore();
    setupApp();
    const res = await request(app).get("/api/v1/stats/overview");

    expect(res.status).to.equal(401);
    expect(res.body).to.have.property("error");
  });
});
