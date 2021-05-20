import React, { ReactElement } from "react";
import squareLeft from "../assets/square-one.png";
import squareRight from "../assets/square-two.png";

import cart from "../assets/cart.png";
import rules from "../assets/rules.png";
import { useAuth } from "../context/AuthContext";
import ReactTooltip from "react-tooltip";
import Shop from "./Shop";
import Rulebook from "./Rulebook";
import { useLocation } from "react-router-dom";

interface Props {}

export default function HUD({}: Props): ReactElement {
  const auth = useAuth();

  const [shopOpen, setShopOpen] = React.useState(false);

  const [rulebookOpen, setRulebookOpen] = React.useState(false);

  const location = useLocation();

  return (
    <div className="hud">
      {auth?.user && (
        <div
          onClick={() => {
            setShopOpen(true);
          }}
          data-tip="Shop"
          className="icon icon--1"
        >
          <img src={squareLeft} alt="" />
          <img src={cart} alt="" className="logo" />
        </div>
      )}
      <ReactTooltip effect="solid" type="light" />

      <div
        onClick={() => {
          setRulebookOpen(true);
        }}
        data-tip="Rulebook"
        className="icon icon--2"
      >
        <img src={squareRight} alt="" />
        <img src={rules} alt="" className="logo" />
      </div>
      <ReactTooltip effect="solid" type="light" />

      {auth?.user && location.pathname === "/" && (
        <div onClick={auth?.logout} data-tip="Logout" className="logout">
          <img src={squareLeft} alt="" />
          <i className="fas fa-power-off"></i>
        </div>
      )}
      <ReactTooltip effect="solid" type="light" />

      <Shop
        open={shopOpen}
        closeHandler={() => {
          setShopOpen(false);
        }}
      />
      <Rulebook
        open={rulebookOpen}
        closeHandler={() => {
          setRulebookOpen(false);
        }}
      />
    </div>
  );
}