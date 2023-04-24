
import mongoose from "mongoose"

const schema = new mongoose.Schema({
    Title: {
        type: String,
    },
    Date: {
        type: Date,
    },
    ClassID: {
        type: mongoose.Schema.Types.ObjectId,
        ref:"ClassID",
    },
    GoodLevel: Number,
    MediumLevel: Number,
    Description: String,
    Type: String,
})
const HomeworkSchema = mongoose.model("Homework", schema);
export default HomeworkSchema

