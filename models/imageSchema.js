import { mongoose } from "mongoose";

const imgageSchema = mongoose.Schema(
  {
    location: {
      type: String,
      required: true,
    },
    subLocation: String,
    museumName: {
      type: String,
      required: true,
    },
    locationImage: [],
    category: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    likes: {
      type: Number,
    },
    comment: {
      type: Number,
    },
    price: {
      type: Number,
    },
    popularPlaces: [
      {
        Mname: String,
        Mdescription: String,
        Mlikes: Number,
        Mcomments: Number,
        Mimage: [],
        Msublocation: String,
        Mprice: Number,
      },
      {
        Mname: String,
        Mdescription: String,
        Mlikes: Number,
        Mcomments: Number,
        Mimage: [],
        Msublocation: String,
        Mprice: Number,
      },
      {
        Mname: String,
        Mdescription: String,
        Mlikes: Number,
        Mcomments: Number,
        Mimage: [],
        Msublocation: String,
        Mprice: Number,
      },
    ],
    included: [],
    notincluded: [],
    customerImages: [],
    comments: [
      {
        name: String,
        date: String,
        comment: String,
        stars: Number,
      },
    ],
  },
  {
    timestamps: true,
  }
);

const imageModel = mongoose.model("scroller", imgageSchema);

export default imageModel;
