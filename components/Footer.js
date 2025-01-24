/*global chrome*/
import React, { useContext } from "react";
import { Context } from "../src/context";
import MailIcon from "../assets/mail.svg";
import DiscordIcon from "../assets/discord.svg";

const Footer = () => {
  // const { user } = useContext(Context);
  // const [userData, setUserData] = user;

  const handleDiscordClick = () => {
    chrome.tabs.create({ url: "https://discord.gg/u5K6wCa458" });
  };
  return (
    <>
      <div></div>
      <h3 style={{ "text-align": "center" }}>Perplexify Wikipedia</h3>

      <div className="contact">
        <div onClick={handleDiscordClick}>
          <img
            src={DiscordIcon}
            height="22px"
            width="22px"
            title="Discord Icon"
            as="image"
            alt="Discord Icon"
          />
        </div>
        <a href="mailto:quotebucketinfo@gmail.com?subject=Question%20-%20Feedback%20about%20Lanter&body=Hi%20there%2C%0A%0A">
          <img
            src={MailIcon}
            height="22px"
            width="22px"
            title="Discord Icon"
            as="image"
            alt="Discord Icon"
          />
        </a>
      </div>
    </>
  );
};

export default Footer;
