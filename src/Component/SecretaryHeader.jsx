import React from "react";
import "./Secretaryheader.css";
import SecretaryUserinfo from "./SecretaryUserinfo";
import SecretaryNavbar from "./SecretaryNavbar";

function SecretaryHeader() {
  return (
    <header id="header" className="header">
      <SecretaryUserinfo />
      <SecretaryNavbar />
    </header>
  );
}

export default SecretaryHeader;
