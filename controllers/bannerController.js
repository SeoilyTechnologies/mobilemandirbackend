// controllers/bannerController.js
const Banner = require("../models/banner_schema");


// ✅ CREATE BANNER (Admin)
exports.createBanner = async (req, res) => {
  try {
    const { title, banner_image, relatedModel, relatedItem } = req.body;

    if (!banner_image || !relatedModel || !relatedItem) {
      return res.status(400).json({
        success: false,
        message: "banner_image, relatedModel and relatedItem are required",
      });
    }

    const banner = await Banner.create({
      title,
      banner_image,
      relatedModel,
      relatedItem,
    });

    return res.status(201).json({
      success: true,
      message: "Banner created successfully",
      data: banner,
    });
  } catch (error) {
    console.error("createBanner error:", error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


// ✅ GET ALL ACTIVE BANNERS (Home screen)
exports.getAllBanners = async (req, res) => {
  try {
    const banners = await Banner.find({ isActive: true })
      .sort({ priority: -1 })
      .populate("relatedItem");

    const bannersWithGod = await Promise.all(
      banners.map(async (banner) => {
        if (
          banner.relatedModel === "aartichalisadata" &&
          banner.relatedItem?.god
        ) {
          await banner.relatedItem.populate({
            path: "god",
            model: "goddata",
          });
        }
        return banner;
      })
    );

    return res.status(200).json({
      success: true,
      count: bannersWithGod.length,
      data: bannersWithGod,
    });
  } catch (error) {
    console.error("getAllBanners error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};




// ✅ BANNER CLICK → GET RELATED DATA
exports.getBannerDetail = async (req, res) => {
  try {
    const { bannerId } = req.params;

    const banner = await Banner.findById(bannerId)
      .populate("relatedItem"); // 🔥 magic

    if (!banner) {
      return res.status(404).json({
        success: false,
        message: "Banner not found",
      });
    }

    return res.status(200).json({
      success: true,
      banner: {
        _id: banner._id,
        title: banner.title,
        banner_image: banner.banner_image,
        relatedModel: banner.relatedModel,
      },
      data: banner.relatedItem, // 👈 full schema data
    });
  } catch (error) {
    console.error("getBannerDetail error:", error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
