import type { NextPage } from "next";
import { styled } from "@linaria/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faExternalLinkAlt } from "@fortawesome/free-solid-svg-icons";

const Home: NextPage = () => {
  return (
    <Container>
      <LogoContainer>
        <Logo src="logo.svg" alt="logo" />
        <LogoTitle src="logo_title.svg" alt="touyou" />
      </LogoContainer>
      <Description>
        Under Construction...
        <br />
        <a href="https://touyou.github.io" target="_blank" rel="noreferrer">
          <FontAwesomeIcon icon={faExternalLinkAlt} size="xs" />{" "}
          大学時代のサイト
        </a>
      </Description>
      <Footer>Copyrights © 2015- touyou. All Rights Reserved.</Footer>
    </Container>
  );
};

export default Home;

const Container = styled.div`
  background: #111111;
  width: 100vw;
  height: calc(100vh - 16px);

  display: flex;
  // flex
  flex-direction: column;
  flex-wrap: nowrap;
  justify-content: center;
  align-items: center;
  align-content: center;

  padding-bottom: 16px;
`;

const LogoContainer = styled.div`
  position: relative;
  flex: auto;
  width: 30%;
  margin: auto;

  img {
    position: absolute;
  }
`;

const Logo = styled.img`
  top: calc(100vh / 5);
  width: calc(100vh / 2);
  height: calc(100vh / 5);
  animation: logoRotation 10s ease infinite 0s;

  @keyframes logoRotation {
    0% {
      transform: rotate(0deg);
    }

    5% {
      transform: rotate(0deg);
    }

    25% {
      transform: rotate(-90deg);
    }

    30% {
      transform: rotate(-90deg);
    }

    50% {
      transform: rotate(-180deg);
    }

    55% {
      transform: rotate(-180deg);
    }

    75% {
      transform: rotate(-270deg);
    }

    80% {
      transform: rotate(-270deg);
    }

    100% {
      transform: rotate(-360deg);
    }
  }
`;

const LogoTitle = styled.img`
  top: calc(100vh / 2);
  width: calc(100vh / 2);
`;

const Description = styled.p`
  color: #ffffff;
  font-size: 1.6rem;
  text-align: center;

  a {
    display: inline-block;
    background-color: #ffffff;
    color: #111111;
    font-size: 1rem;
    text-decoration: none;
    margin-top: 8px;
    padding: 4px 8px;
    cursor: pointer;
    transition: 0.2s;
  }

  a:hover {
    background-color: #666666;
  }

  svg {
    display: inline-block;
    width: 0.9rem;
    height: 0.9rem;
    margin: auto;
  }
`;

const Footer = styled.footer`
  color: #eeeeee;
  text-align: center;
  font-size: 0.8rem;
  font-weight: normal;
`;
