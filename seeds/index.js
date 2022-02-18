const mongoose = require("mongoose");
const Message = require("../models/message");
const Education = require("../models/education");
const Experience = require("../models/experience");
const Project = require("../models/project");

mongoose.connect("mongodb://localhost:27017/portfolio", {
    useUnifiedTopology: true
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database Connected");
});

const seedDB = async () => {
    // deletes all data from all collections

    await Message.deleteMany({});
    await Education.deleteMany({});
    await Experience.deleteMany({});
    await Project.deleteMany({});

    await new Education({name: "Georgia Institute of Technology", description: "Computer Science B.S.", link: "https://www.gatech.edu", startDate: Date.parse("15 Aug 2022")}).save();
    await new Education({
                        name: "The Academy For Information Technology", 
                        description: "A Magnet high school with a curriculum focus on Computer Science and Business", 
                        link: "https://www.ucvts.tec.nj.us",
                        startDate: Date.parse("7 Sep 2018"),
                        endDate: Date.parse("22 Jun 2022")
                    }).save();

    await new Experience({
                        title: "Junior Software Developer", 
                        employer: "LogicomUSA",
                        stack: ["HTML", "CSS", "JavaScript", "Bootstrap", "JQuery", "PHP", "SQL"],
                        link: "https://logicomusa.net",
                        startDate: Date.parse("18 Aug 2021")
                    }).save();
    
}
seedDB().then(() => {
    mongoose.connection.close();
});