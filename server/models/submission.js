const mongoose = require("mongoose");
const submissionSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    problem: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Problem",
      required: true,
    },
    language: {
      type: String,
      required: true,
    },
    code: {
      type: String,
      required: true,
    },
    verdicts: {
      type: [mongoose.Schema.Types.Mixed], // true, false, or string (error)
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.models.Submission || mongoose.model("Submission", submissionSchema);
