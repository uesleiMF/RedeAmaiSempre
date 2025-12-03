import React, { useState } from "react";
import { Container, List, Logo, Hamburger, OverlayMenu } from "./NavbarStyles";
import { FaRegUser, FaHeartbeat } from "react-icons/fa";
import { ImManWoman } from "react-icons/im";
import { GiMusicalNotes } from "react-icons/gi";
import { Link } from "react-router-dom";
import c1 from "../../components/Img/ieq2.jpg";

export default function Navbar() {
  const [open, setOpen] = useState(false);

  const handleClose = () => setOpen(false);

  return (
    <Container>
      {/* Logo */}
      <Logo>
        <a
          href="https://maps.app.goo.gl/e9p6hr2WNqNPU19V9"
          target="_blank"
          rel="noopener noreferrer"
        >
          <img src={c1} alt="logo" />
        </a>
      </Logo>

      {/* Links Desktop */}
      <List>
        <li>
          <Link to="/home">
            <FaHeartbeat />
          </Link>
        </li>
        <li>
          <Link to="/sobrenos">
            <ImManWoman />
          </Link>
        </li>
        <li>
          <Link to="/app">
            <GiMusicalNotes />
          </Link>
        </li>
        <li>
          <Link to="/">
            <FaRegUser />
          </Link>
        </li>
      </List>

      {/* Hamburger */}
      <Hamburger
        className={open ? "open" : ""}
        onClick={() => setOpen(!open)}
      >
        <span></span>
        <span></span>
        <span></span>
      </Hamburger>

      {/* Overlay Menu Mobile */}
      <OverlayMenu open={open}>
        <Link to="/home" onClick={handleClose}>
          <FaHeartbeat />
        </Link>
        <Link to="/sobrenos" onClick={handleClose}>
          <ImManWoman />
        </Link>
        <Link to="/app" onClick={handleClose}>
          <GiMusicalNotes />
        </Link>
        <Link to="/" onClick={handleClose}>
          <FaRegUser />
        </Link>
      </OverlayMenu>
    </Container>
  );
}

