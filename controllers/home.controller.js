const { Resend } = require("resend");
const resend = new Resend("re_5L5Ae944_LJAFbuvm4gXqXRtVDCSk25d4");

module.exports.homeController = (req, res) => {
  res.render("home");
};

module.exports.contactController = async (req, res) => {
  res.render("contact");
};

module.exports.sendVerificationEmail = async (req, res) => {
  try {
    const { message } = req.body;
    const { error } = await resend.emails.send({
      from: "onboarding@resend.dev",
      to: ["karansbisht7@gmail.com"],
      subject: message,
      html: "it works!",
    });

    if (error) {
      return res.status(400).json({ error });
    }

    res.redirect("/agribuzz");
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
